import bpy
import math
import os
from mathutils import Vector


INPUT_GLB = r"D:\Code\Last Call\output\blender\shaker.glb"
OUTPUT_BLEND = r"D:\Code\Last Call\output\blender\shaker_stainless.blend"
OUTPUT_GLB = r"D:\Code\Last Call\output\blender\shaker_stainless.glb"
OUTPUT_PREVIEW = r"D:\Code\Last Call\output\blender\shaker-stainless-preview.png"


def set_input(node, name, value):
    socket = node.inputs.get(name)
    if socket is not None:
        socket.default_value = value


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def make_stainless_material():
    mat = bpy.data.materials.get("LC_Brushed_Stainless_Steel")
    if mat is None:
        mat = bpy.data.materials.new("LC_Brushed_Stainless_Steel")

    mat.use_nodes = True
    mat.diffuse_color = (0.86, 0.88, 0.9, 1.0)
    mat.metallic = 1.0
    mat.roughness = 0.18

    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    output.name = "Stainless Output"
    output.location = (620, 0)

    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.name = "Brushed Stainless Principled"
    shader.location = (280, 0)
    set_input(shader, "Base Color", (0.86, 0.88, 0.9, 1.0))
    set_input(shader, "Metallic", 1.0)
    set_input(shader, "Roughness", 0.18)
    set_input(shader, "IOR", 1.45)
    set_input(shader, "Coat Weight", 0.12)
    set_input(shader, "Coat Roughness", 0.16)
    set_input(shader, "Anisotropic IOR Level", 0.2)
    set_input(shader, "Anisotropic Weight", 0.2)

    texcoord = nodes.new("ShaderNodeTexCoord")
    texcoord.location = (-680, 0)

    mapping = nodes.new("ShaderNodeMapping")
    mapping.name = "Vertical Brushing Scale"
    mapping.location = (-500, 0)
    mapping.inputs["Scale"].default_value = (1.0, 1.0, 1.0)

    wave = nodes.new("ShaderNodeTexWave")
    wave.name = "Fine Vertical Brushing"
    wave.location = (-280, 80)
    wave.wave_type = "BANDS"
    wave.bands_direction = "X"
    set_input(wave, "Scale", 185.0)
    set_input(wave, "Distortion", 5.0)
    set_input(wave, "Detail", 3.0)
    set_input(wave, "Detail Scale", 2.0)
    set_input(wave, "Detail Roughness", 0.35)

    noise = nodes.new("ShaderNodeTexNoise")
    noise.name = "Soft Metal Variation"
    noise.location = (-280, -120)
    set_input(noise, "Scale", 4.0)
    set_input(noise, "Detail", 2.0)
    set_input(noise, "Roughness", 0.42)

    mix = nodes.new("ShaderNodeMixRGB")
    mix.name = "Brushing Variation"
    mix.blend_type = "MULTIPLY"
    mix.inputs[0].default_value = 0.7
    mix.location = (-40, 30)

    bump = nodes.new("ShaderNodeBump")
    bump.name = "Micro Brushed Normal"
    bump.location = (80, -150)
    set_input(bump, "Strength", 0.022)
    set_input(bump, "Distance", 0.006)

    links.new(texcoord.outputs["Generated"], mapping.inputs["Vector"])
    links.new(mapping.outputs["Vector"], wave.inputs["Vector"])
    links.new(mapping.outputs["Vector"], noise.inputs["Vector"])
    links.new(wave.outputs["Color"], mix.inputs[1])
    links.new(noise.outputs["Fac"], mix.inputs[2])
    links.new(mix.outputs["Color"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])

    return mat


def add_studio_preview(meshes):
    studio = bpy.data.collections.new("__STUDIO_PREVIEW__")
    bpy.context.scene.collection.children.link(studio)

    floor_mat = bpy.data.materials.new("Studio Charcoal Floor")
    floor_mat.diffuse_color = (0.018, 0.02, 0.024, 1.0)
    floor_mat.use_nodes = True
    floor_shader = floor_mat.node_tree.nodes.get("Principled BSDF")
    set_input(floor_shader, "Base Color", (0.018, 0.02, 0.024, 1.0))
    set_input(floor_shader, "Roughness", 0.32)
    set_input(floor_shader, "Metallic", 0.05)

    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, -0.52))
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
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.18

    def add_area(name, location, energy, size, color):
        data = bpy.data.lights.new(name, "AREA")
        data.energy = energy
        data.shape = "DISK"
        data.size = size
        data.color = color
        obj = bpy.data.objects.new(name, data)
        studio.objects.link(obj)
        obj.location = location
        look_at(obj, (0, 0, 0.05))
        return obj

    add_area("__Key Softbox", (2.8, -2.8, 3.2), 700, 2.4, (1.0, 0.78, 0.56))
    add_area("__Cool Rim", (-2.4, 1.5, 2.0), 520, 2.0, (0.47, 0.7, 1.0))
    add_area("__Top Strip", (0.0, 0.4, 3.7), 450, 1.6, (1.0, 0.92, 0.78))

    camera_data = bpy.data.cameras.new("__Studio Camera")
    camera = bpy.data.objects.new("__Studio Camera", camera_data)
    studio.objects.link(camera)
    camera.location = (1.75, -2.75, 1.12)
    camera_data.lens = 58
    camera_data.sensor_width = 36
    look_at(camera, (0.0, 0.0, 0.02))
    bpy.context.scene.camera = camera

    scene = bpy.context.scene
    # Blender 5.2 exposes the Eevee engine as BLENDER_EEVEE.
    # Keep this compatible with older Blender releases as well.
    available_engines = {item.identifier for item in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items}
    scene.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in available_engines else "BLENDER_EEVEE"
    scene.render.resolution_x = 900
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = OUTPUT_PREVIEW
    scene.render.film_transparent = False
    scene.view_settings.look = "AgX - Medium High Contrast"

    bpy.ops.render.render(write_still=True)


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=INPUT_GLB)

    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and obj.name.startswith("tripo_part_")]
    if not meshes:
        raise RuntimeError("No tripo_part_* mesh objects found in imported GLB")

    material = make_stainless_material()
    for obj in meshes:
        obj.data.materials.clear()
        obj.data.materials.append(material)
        obj["material_profile"] = "LC_Brushed_Stainless_Steel"

    root = bpy.data.objects.get("ROOT")
    if root:
        root["asset_type"] = "boston_shaker"
        root["material_profile"] = "LC_Brushed_Stainless_Steel"

    add_studio_preview(meshes)

    os.makedirs(os.path.dirname(OUTPUT_BLEND), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=OUTPUT_BLEND)

    for obj in bpy.context.selected_objects:
        obj.select_set(False)
    for obj in meshes:
        obj.select_set(True)
    if root:
        root.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]

    bpy.ops.export_scene.gltf(
        filepath=OUTPUT_GLB,
        export_format="GLB",
        use_selection=True,
        export_apply=False,
        export_animations=True,
    )

    print("SHAPER_STAINLESS_RESULT", {
        "blend": OUTPUT_BLEND,
        "glb": OUTPUT_GLB,
        "preview": OUTPUT_PREVIEW,
        "mesh_count": len(meshes),
        "material": material.name,
    })


if __name__ == "__main__":
    main()
