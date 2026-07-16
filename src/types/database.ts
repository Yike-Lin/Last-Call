export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      asset_licenses: {
        Row: {
          commercial_use_allowed: boolean
          created_at: string
          credit_text: string | null
          expires_at: string | null
          id: string
          license_type: string
          modification_allowed: boolean
          proof_storage_path: string | null
          rights_holder: string
          source_url: string | null
          updated_at: string
        }
        Insert: {
          commercial_use_allowed?: boolean
          created_at?: string
          credit_text?: string | null
          expires_at?: string | null
          id?: string
          license_type: string
          modification_allowed?: boolean
          proof_storage_path?: string | null
          rights_holder: string
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          commercial_use_allowed?: boolean
          created_at?: string
          credit_text?: string | null
          expires_at?: string | null
          id?: string
          license_type?: string
          modification_allowed?: boolean
          proof_storage_path?: string | null
          rights_holder?: string
          source_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      glassware: {
        Row: {
          capacity_ml: number | null
          created_at: string
          id: string
          name_en: string
          name_zh: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          capacity_ml?: number | null
          created_at?: string
          id?: string
          name_en: string
          name_zh?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          capacity_ml?: number | null
          created_at?: string
          id?: string
          name_en?: string
          name_zh?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          aliases: string[]
          category: string
          color_hex: string | null
          created_at: string
          default_abv: number | null
          flavor_tags: string[]
          id: string
          is_alcoholic: boolean
          name_en: string
          name_zh: string | null
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          aliases?: string[]
          category: string
          color_hex?: string | null
          created_at?: string
          default_abv?: number | null
          flavor_tags?: string[]
          id?: string
          is_alcoholic?: boolean
          name_en: string
          name_zh?: string | null
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          aliases?: string[]
          category?: string
          color_hex?: string | null
          created_at?: string
          default_abv?: number | null
          flavor_tags?: string[]
          id?: string
          is_alcoholic?: boolean
          name_en?: string
          name_zh?: string | null
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      mix_session_steps: {
        Row: {
          action_type: string
          created_at: string
          id: string
          ingredient_id: string | null
          mix_session_id: string
          payload: Json
          step_index: number
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          ingredient_id?: string | null
          mix_session_id: string
          payload?: Json
          step_index: number
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          ingredient_id?: string | null
          mix_session_id?: string
          payload?: Json
          step_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "mix_session_steps_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mix_session_steps_mix_session_id_fkey"
            columns: ["mix_session_id"]
            isOneToOne: false
            referencedRelation: "mix_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mix_sessions: {
        Row: {
          completed_at: string | null
          id: string
          recipe_id: string | null
          selected_glassware: string | null
          selected_method: string | null
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          recipe_id?: string | null
          selected_glassware?: string | null
          selected_method?: string | null
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          recipe_id?: string | null
          selected_glassware?: string | null
          selected_method?: string | null
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mix_sessions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mix_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          preferred_unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          preferred_unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      recipe_assets: {
        Row: {
          alt_text: string
          asset_type: string
          created_at: string
          height: number | null
          id: string
          is_primary: boolean
          license_id: string | null
          recipe_id: string
          sort_order: number
          storage_path: string
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text: string
          asset_type: string
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          license_id?: string | null
          recipe_id: string
          sort_order?: number
          storage_path: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string
          asset_type?: string
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          license_id?: string | null
          recipe_id?: string
          sort_order?: number
          storage_path?: string
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_assets_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "asset_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_assets_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          amount_value: number | null
          display_amount: string | null
          id: string
          ingredient_id: string
          is_optional: boolean
          normalized_ml: number | null
          preparation_note: string | null
          recipe_id: string
          role: string
          sort_order: number
          unit_code: string
        }
        Insert: {
          amount_value?: number | null
          display_amount?: string | null
          id?: string
          ingredient_id: string
          is_optional?: boolean
          normalized_ml?: number | null
          preparation_note?: string | null
          recipe_id: string
          role?: string
          sort_order?: number
          unit_code: string
        }
        Update: {
          amount_value?: number | null
          display_amount?: string | null
          id?: string
          ingredient_id?: string
          is_optional?: boolean
          normalized_ml?: number | null
          preparation_note?: string | null
          recipe_id?: string
          role?: string
          sort_order?: number
          unit_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_sources: {
        Row: {
          created_at: string
          editor_notes: string | null
          external_id: string | null
          id: string
          is_primary: boolean
          recipe_id: string
          retrieved_at: string
          rights_note: string | null
          source_category: string | null
          source_name: string
          source_type: string
          source_url: string
        }
        Insert: {
          created_at?: string
          editor_notes?: string | null
          external_id?: string | null
          id?: string
          is_primary?: boolean
          recipe_id: string
          retrieved_at?: string
          rights_note?: string | null
          source_category?: string | null
          source_name: string
          source_type: string
          source_url: string
        }
        Update: {
          created_at?: string
          editor_notes?: string | null
          external_id?: string | null
          id?: string
          is_primary?: boolean
          recipe_id?: string
          retrieved_at?: string
          rights_note?: string | null
          source_category?: string | null
          source_name?: string
          source_type?: string
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_sources_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_steps: {
        Row: {
          action_type: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          instruction_en: string | null
          instruction_zh: string | null
          recipe_id: string
          step_number: number
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          instruction_en?: string | null
          instruction_zh?: string | null
          recipe_id: string
          step_number: number
        }
        Update: {
          action_type?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          instruction_en?: string | null
          instruction_zh?: string | null
          recipe_id?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_tags: {
        Row: {
          created_at: string
          recipe_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          recipe_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          recipe_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          aliases: string[]
          balance_bitter: number
          balance_sour: number
          balance_spirit: number
          balance_sweet: number
          calories_kcal: number | null
          created_at: string
          description_en: string | null
          description_zh: string | null
          difficulty: number
          estimated_abv: number | null
          garnish_text: string | null
          glassware_id: string | null
          iba_category: string | null
          ice_style: string | null
          id: string
          name_en: string
          name_zh: string | null
          origin_country_code: string | null
          prep_time_seconds: number | null
          primary_method: string
          primary_spirit_id: string | null
          published_at: string | null
          pure_alcohol_g: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          servings: number
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          aliases?: string[]
          balance_bitter?: number
          balance_sour?: number
          balance_spirit?: number
          balance_sweet?: number
          calories_kcal?: number | null
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          difficulty?: number
          estimated_abv?: number | null
          garnish_text?: string | null
          glassware_id?: string | null
          iba_category?: string | null
          ice_style?: string | null
          id?: string
          name_en: string
          name_zh?: string | null
          origin_country_code?: string | null
          prep_time_seconds?: number | null
          primary_method: string
          primary_spirit_id?: string | null
          published_at?: string | null
          pure_alcohol_g?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          servings?: number
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          aliases?: string[]
          balance_bitter?: number
          balance_sour?: number
          balance_spirit?: number
          balance_sweet?: number
          calories_kcal?: number | null
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          difficulty?: number
          estimated_abv?: number | null
          garnish_text?: string | null
          glassware_id?: string | null
          iba_category?: string | null
          ice_style?: string | null
          id?: string
          name_en?: string
          name_zh?: string | null
          origin_country_code?: string | null
          prep_time_seconds?: number | null
          primary_method?: string
          primary_spirit_id?: string | null
          published_at?: string | null
          pure_alcohol_g?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          servings?: number
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_glassware_id_fkey"
            columns: ["glassware_id"]
            isOneToOne: false
            referencedRelation: "glassware"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_primary_spirit_id_fkey"
            columns: ["primary_spirit_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          label_en: string
          label_zh: string | null
          slug: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          label_en: string
          label_zh?: string | null
          slug: string
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          label_en?: string
          label_zh?: string | null
          slug?: string
          type?: string
        }
        Relationships: []
      }
      tasting_results: {
        Row: {
          appearance: string | null
          balance_bitter: number
          balance_sour: number
          balance_spirit: number
          balance_sweet: number
          body: string | null
          created_at: string
          flavor_tags: string[]
          id: string
          mix_session_id: string
          suggested_occasions: string[]
          summary: string | null
          user_notes: string | null
        }
        Insert: {
          appearance?: string | null
          balance_bitter?: number
          balance_sour?: number
          balance_spirit?: number
          balance_sweet?: number
          body?: string | null
          created_at?: string
          flavor_tags?: string[]
          id?: string
          mix_session_id: string
          suggested_occasions?: string[]
          summary?: string | null
          user_notes?: string | null
        }
        Update: {
          appearance?: string | null
          balance_bitter?: number
          balance_sour?: number
          balance_spirit?: number
          balance_sweet?: number
          body?: string | null
          created_at?: string
          flavor_tags?: string[]
          id?: string
          mix_session_id?: string
          suggested_occasions?: string[]
          summary?: string | null
          user_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasting_results_mix_session_id_fkey"
            columns: ["mix_session_id"]
            isOneToOne: true
            referencedRelation: "mix_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cabinet_items: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cabinet_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cabinet_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          remote_table_id: string | null
          shard_id: string | null
          shard_key: string | null
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const
