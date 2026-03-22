export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          category: string | null
          color_hex: string | null
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          title: string
        }
        Insert: {
          category?: string | null
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string | null
          color_hex?: string | null
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          target_value: number | null
          title: string
          unit: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          target_value?: number | null
          title: string
          unit?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          target_value?: number | null
          title?: string
          unit?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      learning_sessions: {
        Row: {
          activity_date: string | null
          course_id: string | null
          created_at: string | null
          duration_minutes: number
          id: string
          user_id: string | null
        }
        Insert: {
          activity_date?: string | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          user_id?: string | null
        }
        Update: {
          activity_date?: string | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_mastery_stats"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "learning_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          completed_at: string | null
          id: string
          is_completed: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_streak: number | null
          daily_goal_hours: number | null
          full_name: string | null
          id: string
          last_activity_date: string | null
          notify_reminders: boolean | null
          notify_streaks: boolean | null
          notify_weekly_report: boolean | null
          preferred_time_range: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number | null
          daily_goal_hours?: number | null
          full_name?: string | null
          id: string
          last_activity_date?: string | null
          notify_reminders?: boolean | null
          notify_streaks?: boolean | null
          notify_weekly_report?: boolean | null
          preferred_time_range?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number | null
          daily_goal_hours?: number | null
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          notify_reminders?: boolean | null
          notify_streaks?: boolean | null
          notify_weekly_report?: boolean | null
          preferred_time_range?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recently_accessed: {
        Row: {
          accessed_at: string | null
          id: string
          section_id: string | null
          user_id: string | null
        }
        Insert: {
          accessed_at?: string | null
          id?: string
          section_id?: string | null
          user_id?: string | null
        }
        Update: {
          accessed_at?: string | null
          id?: string
          section_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recently_accessed_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          content_type: string | null
          content_url: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          order_index: number
          section_number: string | null
          title: string
          unit_id: string | null
        }
        Insert: {
          content_type?: string | null
          content_url?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index: number
          section_number?: string | null
          title: string
          unit_id?: string | null
        }
        Update: {
          content_type?: string | null
          content_url?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number
          section_number?: string | null
          title?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          order_index: number
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          order_index: number
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_mastery_stats"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "units_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: string
          is_completed: boolean | null
          section_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          section_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          section_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          course_id: string | null
          id: string
          score: number | null
          skill_name: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          id?: string
          score?: number | null
          skill_name: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          id?: string
          score?: number | null
          skill_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_mastery_stats"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "user_skills_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      course_mastery_stats: {
        Row: {
          completion_percentage: number | null
          course_id: string | null
          course_title: string | null
          remaining_minutes: number | null
          remaining_sections: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
