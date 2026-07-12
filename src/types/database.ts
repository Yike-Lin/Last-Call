export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string;
          id: string;
          recipe_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          recipe_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          recipe_id?: string;
          user_id?: string;
        };
      };
      ingredients: {
        Row: {
          abv: number | null;
          category: string;
          color_hex: string | null;
          created_at: string;
          flavor_tags: string[];
          id: string;
          is_alcoholic: boolean;
          name: string;
          slug: string;
        };
        Insert: {
          abv?: number | null;
          category: string;
          color_hex?: string | null;
          created_at?: string;
          flavor_tags?: string[];
          id?: string;
          is_alcoholic?: boolean;
          name: string;
          slug: string;
        };
        Update: {
          abv?: number | null;
          category?: string;
          color_hex?: string | null;
          created_at?: string;
          flavor_tags?: string[];
          id?: string;
          is_alcoholic?: boolean;
          name?: string;
          slug?: string;
        };
      };
      mix_session_steps: {
        Row: {
          action_type: string;
          created_at: string;
          id: string;
          ingredient_id: string | null;
          mix_session_id: string;
          payload: Json;
          step_index: number;
        };
        Insert: {
          action_type: string;
          created_at?: string;
          id?: string;
          ingredient_id?: string | null;
          mix_session_id: string;
          payload?: Json;
          step_index: number;
        };
        Update: {
          action_type?: string;
          created_at?: string;
          id?: string;
          ingredient_id?: string | null;
          mix_session_id?: string;
          payload?: Json;
          step_index?: number;
        };
      };
      mix_sessions: {
        Row: {
          completed_at: string | null;
          id: string;
          recipe_id: string | null;
          selected_glassware: string | null;
          selected_method: string | null;
          started_at: string;
          status: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          id?: string;
          recipe_id?: string | null;
          selected_glassware?: string | null;
          selected_method?: string | null;
          started_at?: string;
          status?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          id?: string;
          recipe_id?: string | null;
          selected_glassware?: string | null;
          selected_method?: string | null;
          started_at?: string;
          status?: string;
          user_id?: string;
        };
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          id: string;
          preferred_unit: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          id: string;
          preferred_unit?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          id?: string;
          preferred_unit?: string;
          updated_at?: string;
        };
      };
      recipe_ingredients: {
        Row: {
          amount: number;
          id: string;
          ingredient_id: string;
          is_optional: boolean;
          recipe_id: string;
          sort_order: number;
          unit: string;
        };
        Insert: {
          amount: number;
          id?: string;
          ingredient_id: string;
          is_optional?: boolean;
          recipe_id: string;
          sort_order?: number;
          unit: string;
        };
        Update: {
          amount?: number;
          id?: string;
          ingredient_id?: string;
          is_optional?: boolean;
          recipe_id?: string;
          sort_order?: number;
          unit?: string;
        };
      };
      recipes: {
        Row: {
          balance_bitter: number;
          balance_sour: number;
          balance_spirit: number;
          balance_sweet: number;
          base_spirit: string;
          created_at: string;
          description: string | null;
          difficulty: number;
          estimated_abv: number | null;
          flavor_tags: string[];
          garnish: string | null;
          glassware: string;
          id: string;
          instructions: string[];
          is_published: boolean;
          method: string;
          name: string;
          slug: string;
        };
        Insert: {
          balance_bitter?: number;
          balance_sour?: number;
          balance_spirit?: number;
          balance_sweet?: number;
          base_spirit: string;
          created_at?: string;
          description?: string | null;
          difficulty?: number;
          estimated_abv?: number | null;
          flavor_tags?: string[];
          garnish?: string | null;
          glassware: string;
          id?: string;
          instructions?: string[];
          is_published?: boolean;
          method: string;
          name: string;
          slug: string;
        };
        Update: {
          balance_bitter?: number;
          balance_sour?: number;
          balance_spirit?: number;
          balance_sweet?: number;
          base_spirit?: string;
          created_at?: string;
          description?: string | null;
          difficulty?: number;
          estimated_abv?: number | null;
          flavor_tags?: string[];
          garnish?: string | null;
          glassware?: string;
          id?: string;
          instructions?: string[];
          is_published?: boolean;
          method?: string;
          name?: string;
          slug?: string;
        };
      };
      tasting_results: {
        Row: {
          appearance: string | null;
          balance_bitter: number;
          balance_sour: number;
          balance_spirit: number;
          balance_sweet: number;
          body: string | null;
          created_at: string;
          flavor_tags: string[];
          id: string;
          mix_session_id: string;
          suggested_occasions: string[];
          summary: string | null;
          user_notes: string | null;
        };
        Insert: {
          appearance?: string | null;
          balance_bitter?: number;
          balance_sour?: number;
          balance_spirit?: number;
          balance_sweet?: number;
          body?: string | null;
          created_at?: string;
          flavor_tags?: string[];
          id?: string;
          mix_session_id: string;
          suggested_occasions?: string[];
          summary?: string | null;
          user_notes?: string | null;
        };
        Update: {
          appearance?: string | null;
          balance_bitter?: number;
          balance_sour?: number;
          balance_spirit?: number;
          balance_sweet?: number;
          body?: string | null;
          created_at?: string;
          flavor_tags?: string[];
          id?: string;
          mix_session_id?: string;
          suggested_occasions?: string[];
          summary?: string | null;
          user_notes?: string | null;
        };
      };
      user_cabinet_items: {
        Row: {
          created_at: string;
          id: string;
          ingredient_id: string;
          notes: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          ingredient_id: string;
          notes?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          ingredient_id?: string;
          notes?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
    };
  };
};
