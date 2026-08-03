import bpy
import math
import os
from mathutils import Vector


INPUT_GLB = r"D:\Code\Last Call\output\blender\量杯.glb"
OUTPUT_BLEND = r"D:\Code\Last Call\output\blender\jigger_hollow_stainless.blend"
OUTPUT_GLB = r"D:\Code\Last Call\output\blender\jigger_hollow_stainless.glb"
OUTPUT_PREVIEW = r"D:\Code\Last Call\output\blender\jigger-hollow-stainless-preview.png"
TEXTURE_ROOT = r"D:\Code\Last Call\output\materials\ambientcg\Metal009"
# Override the legacy-codepage path above with an ASCII-only Python escape.
INPUT_GLB = os.path.join(r"D:\Code\Last Call\output\blender", "\u91cf\u676f.glb")


def set_input(node, name, value):
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def load_texture(filename, colorspace):
    path = os.path.join(TEXTURE_ROOT, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    image = bpy.data.images.load(path, check_existing=True)
    image.colorspace_settings.name = colorspace
    image.pack()
    return image


def make_image_node(nodes, image, name, location):
    node = nodes.new("ShaderNodeTexImage")
    node.name = name
    node.label = name
    node.image = image
    node.interpolation = "Linear"
    node.extension = "REPEAT"
    node.location = location
    return node


def make_stainless_material():
    mat = bpy.data.materials.get("LC_Jigger_Metal009_PBR")
    if mat is None:
        mat = bpy.data.materials.new("LC_Jigger_Metal009_PBR")

    mat.use_nodes = True
    mat.diffuse_color = (0.72, 0.75, 0.78, 1.0)
    mat.metallic = 1.0
    mat.roughness = 0.30
    mat["pbr_source"] = "AmbientCG Metal009, CC0"
    mat["pbr_maps"] = "Color, Roughness, NormalGL, Metalness"

    color_image = load_texture("Metal009_2K-PNG_Color.png", "sRGB")
    roughness_image = load_texture("Metal009_2K-PNG_Roughness.png", "Non-Color")
    normal_image = load_texture("Metal009_2K-PNG_NormalGL.png", "Non-Color")
    metalness_image = load_texture("Metal009_2K-PNG_Metalness.png", "Non-Color")

    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    output.name = "Stainless PBR Output"
    output.location = (560, 0)

    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.name = "Metal009 Brushed Stainless Principled"
    shader.location = (280, 0)
    set_input(shader, "Metallic", 1.0)
    set_input(shader, "Roughness", 0.30)
    set_input(shader, "IOR", 1.45)
    set_input(shader, "Coat Weight", 0.08)
    set_input(shader, "Coat Roughness", 0.18)
    set_input(shader, "Anisotropic IOR Level", 0.28)
    set_input(shader, "Anisotropic Weight", 0.3)

    texcoord = nodes.new("ShaderNodeTexCoord")
    texcoord.name = "Jigger UV Coordinates"
    texcoord.location = (-760, 0)

    color = make_image_node(nodes, color_image, "Metal009 Color (sRGB)", (-520, 180))
    roughness = make_image_node(nodes, roughness_image, "Metal009 Roughness (Non-Color)", (-520, 40))
    normal = make_image_node(nodes, normal_image, "Metal009 NormalGL (Non-Color)", (-520, -120))
    metalness = make_image_node(nodes, metalness_image, "Metal009 Metalness (Non-Color)", (-520, -280))

    normal_map = nodes.new("ShaderNodeNormalMap")
    normal_map.name = "Metal009 Tangent Normal"
    normal_map.location = (40, -150)
    set_input(normal_map, "Strength", 0.28)

    links.new(texcoord.outputs["UV"], color.inputs["Vector"])
    links.new(texcoord.outputs["UV"], roughness.inputs["Vector"])
    links.new(texcoord.outputs["UV"], normal.inputs["Vector"])
    links.new(texcoord.outputs["UV"], metalness.inputs["Vector"])
    links.new(color.outputs["Color"], shader.inputs["Base Color"])
    links.new(roughness.outputs["Color"], shader.inputs["Roughness"])
    links.new(normal.outputs["Color"], normal_map.inputs["Color"])
    links.new(normal_map.outputs["Normal"], shader.inputs["Normal"])
    links.new(metalness.outputs["Color"], shader.inputs["Metallic"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])

    return mat


def ensure_uv(obj):
    """Create a stable cylindrical UV layout and tile it at a real tool scale."""
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    if obj.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.cylinder_project(
        direction="ALIGN_TO_OBJECT",
        align="POLAR_ZX",
        radius=1.0,
        correct_aspect=True,
        clip_to_bounds=False,
        scale_to_bounds=False,
    )
    bpy.ops.object.mode_set(mode="OBJECT")
    uv_layer = obj.data.uv_layers.active
    if uv_layer is None:
        raise RuntimeError("Jigger UV unwrap did not create an active UV layer")
    for loop_uv in uv_layer.data:
        loop_uv.uv.x *= 3.0
        loop_uv.uv.y *= 2.4
    obj["uv_layout"] = "cylindrical_z_tiled_3x2.4"

    # Keep a second UV channel reserved for a future occlusion map. glTF uses
    # TEXCOORD_1 for AO, and matching it here avoids another unwrap later.
    uv_ao = obj.data.uv_layers.get("AOMap")
    if uv_ao is None:
        uv_ao = obj.data.uv_layers.new(name="AOMap")
    for index, loop_uv in enumerate(uv_layer.data):
        uv_ao.data[index].uv = loop_uv.uv

def boolean_cavity(obj, name, z, depth, radius_bottom, radius_top):
    bpy.ops.mesh.primitive_cone_add(
        vertices=128,
        radius1=radius_bottom,
        radius2=radius_top,
        depth=depth,
        end_fill_type="NGON",
        location=(0.0, 0.0, z),
    )
    cutter = bpy.context.object
    cutter.name = name
    cutter.hide_render = True
    cutter.display_type = "WIRE"

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    modifier = obj.modifiers.new(name=f"{name} Boolean", type="BOOLEAN")
    modifier.operation = "DIFFERENCE"
    modifier.solver = "EXACT"
    modifier.object = cutter
    bpy.ops.object.modifier_apply(modifier=modifier.name)

    bpy.data.objects.remove(cutter, do_unlink=True)


def reduce_mesh_for_web(obj):
    # The Tripo source is over 1.9M polygons. A controlled collapse keeps the
    # silhouette while making the boolean operation and web delivery practical.
    source_polygons = len(obj.data.polygons)
    decimate = obj.modifiers.new(name="Web Detail Reduction", type="DECIMATE")
    decimate.decimate_type = "COLLAPSE"
    decimate.ratio = 0.22
    decimate.use_collapse_triangulate = True
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier=decimate.name)
    obj["source_polygons"] = source_polygons
    obj["optimized_polygons"] = len(obj.data.polygons)


def make_hollow(obj):
    # The source is centered on Z and has an hourglass profile. Each tapered
    # cutter stops just short of the waist so the two cups remain separated.
    boolean_cavity(
        obj,
        "__Top Cavity Cutter",
        z=0.282,
        depth=0.454,
        radius_bottom=0.060,
        radius_top=0.210,
    )
    boolean_cavity(
        obj,
        "__Bottom Cavity Cutter",
        z=-0.282,
        depth=0.454,
        radius_bottom=0.190,
        radius_top=0.060,
    )


def add_studio_preview(obj):
    studio = bpy.data.collections.new("__STUDIO_PREVIEW__")
    bpy.context.scene.collection.children.link(studio)

    floor_mat = bpy.data.materials.new("Studio Charcoal Floor")
    floor_mat.diffuse_color = (0.018, 0.02, 0.024, 1.0)
    floor_mat.use_nodes = True
    floor_shader = floor_mat.node_tree.nodes.get("Principled BSDF")
    set_input(floor_shader, "Base Color", (0.018, 0.02, 0.024, 1.0))
    set_input(floor_shader, "Roughness", 0.32)
    set_input(floor_shader, "Metallic", 0.05)

    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, -0.54))
    floor = bpy.context.object
    floor.name = "__Studio Floor"
    bpy.context.collection.objects.unlink(floor)
    studio.objects.link(floor)
    floor.data.materials.append(floor_mat)

    world = bpy.context.scene.world
    if world is None:
        world = bpy.data.worlds.new("LC Studio World")
        bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.004, 0.005, 0.007, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.2

    def add_area(name, location, energy, size, color):
        data = bpy.data.lights.new(name, "AREA")
        data.energy = energy
        data.shape = "DISK"
        data.size = size
        data.color = color
        obj_light = bpy.data.objects.new(name, data)
        studio.objects.link(obj_light)
        obj_light.location = location
        look_at(obj_light, (0, 0, 0.0))
        return obj_light

    add_area("__Key Softbox", (2.6, -2.8, 3.0), 720, 2.4, (1.0, 0.78, 0.56))
    add_area("__Cool Rim", (-2.5, 1.4, 2.1), 560, 2.0, (0.47, 0.7, 1.0))
    add_area("__Top Strip", (0.0, 0.2, 3.5), 500, 1.6, (1.0, 0.92, 0.78))

    camera_data = bpy.data.cameras.new("__Studio Camera")
    camera = bpy.data.objects.new("__Studio Camera", camera_data)
    studio.objects.link(camera)
    camera.location = (1.35, -2.65, 1.62)
    camera_data.lens = 58
    camera_data.sensor_width = 36
    look_at(camera, (0.0, 0.0, 0.0))
    bpy.context.scene.camera = camera

    scene = bpy.context.scene
    available_engines = {item.identifier for item in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items}
    scene.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in available_engines else "BLENDER_EEVEE"
    scene.render.resolution_x = 900
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = OUTPUT_PREVIEW
    scene.render.film_transparent = False
    scene.view_settings.look = "AgX - Medium High Contrast"

    # Tilt only for the preview so both openings read clearly; reset before export.
    original_rotation = obj.rotation_euler.copy()
    obj.rotation_euler = (math.radians(-58.0), math.radians(10.0), math.radians(-18.0))
    bpy.ops.render.render(write_still=True)
    obj.rotation_euler = original_rotation


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=INPUT_GLB)

    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if len(meshes) != 1:
        raise RuntimeError(f"Expected exactly one jigger mesh, found {len(meshes)}")
    obj = meshes[0]
    obj.name = "Jigger"

    reduce_mesh_for_web(obj)
    make_hollow(obj)
    ensure_uv(obj)
    material = make_stainless_material()
    obj.data.materials.clear()
    obj.data.materials.append(material)
    obj["asset_type"] = "double_ended_jigger"
    obj["material_profile"] = "LC_Brushed_Stainless_Steel"
    obj["cavities"] = "top_and_bottom_open"

    for polygon in obj.data.polygons:
        polygon.use_smooth = True

    add_studio_preview(obj)

    os.makedirs(os.path.dirname(OUTPUT_BLEND), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=OUTPUT_BLEND)

    # Export only the clean model; studio preview helpers stay in the .blend.
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.export_scene.gltf(
        filepath=OUTPUT_GLB,
        export_format="GLB",
        use_selection=True,
        export_apply=False,
        export_animations=False,
    )

    print("JIGGER_HOLLOW_STAINLESS_RESULT", {
        "blend": OUTPUT_BLEND,
        "glb": OUTPUT_GLB,
        "preview": OUTPUT_PREVIEW,
        "material": material.name,
        "object": obj.name,
        "vertices": len(obj.data.vertices),
        "polygons": len(obj.data.polygons),
    })


if __name__ == "__main__":
    main()
