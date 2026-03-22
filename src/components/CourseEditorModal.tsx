import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCourseWithUnits } from "@/hooks/useDashboardData";
import { useToast } from "@/hooks/use-toast";

type SectionType = "external_url" | "pdf" | "video";

type DraftSection = {
  id?: string;
  title: string;
  contentType: SectionType;
  contentUrl: string;
  durationMinutes: string;
  file: File | null;
};

type DraftUnit = {
  id?: string;
  title: string;
  sections: DraftSection[];
};

const defaultSection = (): DraftSection => ({
  title: "",
  contentType: "external_url",
  contentUrl: "",
  durationMinutes: "15",
  file: null,
});

const defaultUnit = (): DraftUnit => ({
  title: "",
  sections: [defaultSection()],
});

interface CourseEditorModalProps {
  open: boolean;
  onClose: () => void;
  courseId?: string | null;
}

export function CourseEditorModal({ open, onClose, courseId }: CourseEditorModalProps) {
  const isEditMode = !!courseId;
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: existingCourseData } = useCourseWithUnits(courseId ?? undefined);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState<DraftUnit[]>([defaultUnit()]);

  const sortedExistingUnits = useMemo(
    () =>
      (existingCourseData?.units ?? []).map((unit) => ({
        ...unit,
        sections: [...((unit as any).sections ?? [])].sort((a: any, b: any) => a.order_index - b.order_index),
      })),
    [existingCourseData]
  );

  useEffect(() => {
    if (!open) return;
    if (isEditMode) {
      const course = existingCourseData?.course;
      if (!course) return;
      setTitle(course.title ?? "");
      setCategory(course.category ?? "");
      setDescription(course.description ?? "");
      setUnits(
        sortedExistingUnits.length > 0
          ? sortedExistingUnits.map((unit) => ({
              id: unit.id,
              title: unit.title,
              sections:
                unit.sections.length > 0
                  ? unit.sections.map((section: any) => ({
                      id: section.id,
                      title: section.title ?? "",
                      contentType: ((section.content_type ?? "external_url") as SectionType),
                      contentUrl: section.content_url ?? "",
                      durationMinutes: String(section.duration_minutes ?? 15),
                      file: null,
                    }))
                  : [defaultSection()],
            }))
          : [defaultUnit()]
      );
      return;
    }

    setTitle("");
    setCategory("");
    setDescription("");
    setUnits([defaultUnit()]);
  }, [open, isEditMode, existingCourseData, sortedExistingUnits]);

  const uploadFile = async (courseRowId: string, section: DraftSection) => {
    if (!section.file || !user) return section.contentUrl.trim();
    const ext = section.file.name.includes(".")
      ? section.file.name.split(".").pop()
      : "bin";
    const path = `${user.id}/${courseRowId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("course-content").upload(path, section.file, {
      upsert: false,
      contentType: section.file.type || undefined,
    });
    if (error) {
      throw new Error(`File upload failed for "${section.file.name}". You can paste a direct URL instead.`);
    }
    const { data } = supabase.storage.from("course-content").getPublicUrl(path);
    return data.publicUrl;
  };

  const validateForm = () => {
    if (!title.trim()) {
      return "Course title is required.";
    }
    if (units.length < 1) {
      return "At least one unit is required.";
    }
    for (let i = 0; i < units.length; i += 1) {
      const unit = units[i];
      if (!unit.title.trim()) {
        return `Unit ${i + 1} needs a title.`;
      }
      if (unit.sections.length < 1) {
        return `Unit ${i + 1} must include at least one section.`;
      }
      for (let j = 0; j < unit.sections.length; j += 1) {
        const section = unit.sections[j];
        if (!section.title.trim()) {
          return `Section ${i + 1}.${j + 1} needs a title.`;
        }
        if (!section.contentUrl.trim() && !section.file) {
          return `Section ${i + 1}.${j + 1} needs a URL or file upload.`;
        }
      }
    }
    return null;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be signed in.");
      const validationError = validateForm();
      if (validationError) throw new Error(validationError);

      let courseRowId = courseId ?? "";
      if (isEditMode) {
        const { error } = await supabase
          .from("courses")
          .update({
            title: title.trim(),
            category: category.trim() || null,
            description: description.trim() || null,
          })
          .eq("id", courseRowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("courses")
          .insert({
            title: title.trim(),
            category: category.trim() || null,
            description: description.trim() || null,
            icon_name: "Code2",
          })
          .select("id")
          .single();
        if (error) throw error;
        courseRowId = data.id;
      }

      const keptUnitIds = new Set<string>();
      const keptSectionIds = new Set<string>();

      for (let unitIndex = 0; unitIndex < units.length; unitIndex += 1) {
        const unit = units[unitIndex];
        let currentUnitId = unit.id ?? "";

        if (unit.id) {
          const { error } = await supabase
            .from("units")
            .update({
              title: unit.title.trim(),
              order_index: unitIndex + 1,
            })
            .eq("id", unit.id);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from("units")
            .insert({
              course_id: courseRowId,
              title: unit.title.trim(),
              order_index: unitIndex + 1,
            })
            .select("id")
            .single();
          if (error) throw error;
          currentUnitId = data.id;
        }

        keptUnitIds.add(currentUnitId);

        for (let sectionIndex = 0; sectionIndex < unit.sections.length; sectionIndex += 1) {
          const section = unit.sections[sectionIndex];
          const duration = Number(section.durationMinutes) > 0 ? Number(section.durationMinutes) : 15;
          const finalContentUrl = await uploadFile(courseRowId, section);

          if (section.id) {
            const { error } = await supabase
              .from("sections")
              .update({
                unit_id: currentUnitId,
                title: section.title.trim(),
                content_type: section.contentType,
                content_url: finalContentUrl || null,
                duration_minutes: duration,
                order_index: sectionIndex + 1,
                section_number: `${unitIndex + 1}.${sectionIndex + 1}`,
              })
              .eq("id", section.id);
            if (error) throw error;
            keptSectionIds.add(section.id);
          } else {
            const { data, error } = await supabase
              .from("sections")
              .insert({
                unit_id: currentUnitId,
                title: section.title.trim(),
                content_type: section.contentType,
                content_url: finalContentUrl || null,
                duration_minutes: duration,
                order_index: sectionIndex + 1,
                section_number: `${unitIndex + 1}.${sectionIndex + 1}`,
              })
              .select("id")
              .single();
            if (error) throw error;
            keptSectionIds.add(data.id);
          }
        }
      }

      if (isEditMode && existingCourseData) {
        const oldUnits = existingCourseData.units ?? [];
        const oldUnitIds = oldUnits.map((unit) => unit.id);
        const oldSectionIds = oldUnits.flatMap((unit: any) => ((unit.sections ?? []).map((section: any) => section.id)));

        const sectionIdsToDelete = oldSectionIds.filter((id: string) => !keptSectionIds.has(id));
        if (sectionIdsToDelete.length > 0) {
          const { error } = await supabase.from("sections").delete().in("id", sectionIdsToDelete);
          if (error) throw error;
        }

        const unitIdsToDelete = oldUnitIds.filter((id: string) => !keptUnitIds.has(id));
        if (unitIdsToDelete.length > 0) {
          const { error } = await supabase.from("units").delete().in("id", unitIdsToDelete);
          if (error) throw error;
        }
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["courses"] }),
        queryClient.invalidateQueries({ queryKey: ["course_units"] }),
        queryClient.invalidateQueries({ queryKey: ["course_progress_by_course"] }),
        queryClient.invalidateQueries({ queryKey: ["section_stats"] }),
        queryClient.invalidateQueries({ queryKey: ["course_mastery_stats"] }),
      ]);
      toast({
        title: isEditMode ? "Course updated" : "Course created",
        description: "Your course structure has been saved.",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't save course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateUnit = (unitIndex: number, patch: Partial<DraftUnit>) => {
    setUnits((prev) =>
      prev.map((unit, idx) => (idx === unitIndex ? { ...unit, ...patch } : unit))
    );
  };

  const updateSection = (unitIndex: number, sectionIndex: number, patch: Partial<DraftSection>) => {
    setUnits((prev) =>
      prev.map((unit, idx) => {
        if (idx !== unitIndex) return unit;
        return {
          ...unit,
          sections: unit.sections.map((section, sIdx) =>
            sIdx === sectionIndex ? { ...section, ...patch } : section
          ),
        };
      })
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-background/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-card rounded-2xl border border-border/40 shadow-card-hover max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-card/95 backdrop-blur px-6 py-4 border-b border-border/40 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">
              {isEditMode ? "Edit Course" : "Create Course"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Each course needs at least one unit and one section.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-sanctuary"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="course-title" className="text-xs font-medium text-muted-foreground">Course Title</Label>
              <Input
                id="course-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Applied Prompt Engineering"
                className="h-11 bg-background/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="course-category" className="text-xs font-medium text-muted-foreground">Category</Label>
              <Input
                id="course-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="AI Strategy"
                className="h-11 bg-background/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="course-description" className="text-xs font-medium text-muted-foreground">Description</Label>
            <Input
              id="course-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this course helps you master"
              className="h-11 bg-background/60"
            />
          </div>

          <div className="space-y-4">
            {units.map((unit, unitIndex) => (
              <div key={unit.id ?? `unit-${unitIndex}`} className="bg-background/50 border border-border/40 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Unit {unitIndex + 1} Title
                    </Label>
                    <Input
                      value={unit.title}
                      onChange={(e) => updateUnit(unitIndex, { title: e.target.value })}
                      placeholder={`Unit ${unitIndex + 1}`}
                      className="h-10 bg-card"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={() =>
                      setUnits((prev) => prev.filter((_, idx) => idx !== unitIndex))
                    }
                    disabled={units.length <= 1}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Unit
                  </Button>
                </div>

                <div className="space-y-3">
                  {unit.sections.map((section, sectionIndex) => (
                    <div
                      key={section.id ?? `section-${sectionIndex}`}
                      className="border border-border/40 rounded-lg p-3 space-y-3 bg-card"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">
                          Section {unitIndex + 1}.{sectionIndex + 1}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            updateUnit(unitIndex, {
                              sections: unit.sections.filter((_, idx) => idx !== sectionIndex),
                            })
                          }
                          disabled={unit.sections.length <= 1}
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(unitIndex, sectionIndex, { title: e.target.value })}
                          placeholder="Section title"
                          className="h-10"
                        />
                        <Input
                          type="number"
                          min="1"
                          value={section.durationMinutes}
                          onChange={(e) => updateSection(unitIndex, sectionIndex, { durationMinutes: e.target.value })}
                          placeholder="Duration (minutes)"
                          className="h-10"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select
                          value={section.contentType}
                          onChange={(e) =>
                            updateSection(unitIndex, sectionIndex, {
                              contentType: e.target.value as SectionType,
                            })
                          }
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                        >
                          <option value="external_url">URL Article</option>
                          <option value="pdf">PDF</option>
                          <option value="video">Video</option>
                        </select>
                        <Input
                          value={section.contentUrl}
                          onChange={(e) => updateSection(unitIndex, sectionIndex, { contentUrl: e.target.value })}
                          placeholder={
                            section.contentType === "external_url"
                              ? "https://..."
                              : "Paste file URL (optional if uploading below)"
                          }
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Upload file (optional)
                        </Label>
                        <Input
                          type="file"
                          accept={section.contentType === "pdf" ? ".pdf,application/pdf" : "video/*,audio/*,.mp4,.mov,.m4v"}
                          onChange={(e) =>
                            updateSection(unitIndex, sectionIndex, {
                              file: e.target.files?.[0] ?? null,
                            })
                          }
                          className="h-10"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      updateUnit(unitIndex, {
                        sections: [...unit.sections, defaultSection()],
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setUnits((prev) => [...prev, defaultUnit()])}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Unit
          </Button>
        </div>

        <div className="sticky bottom-0 bg-card/95 backdrop-blur px-6 py-4 border-t border-border/40 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-sage text-primary-foreground hover:bg-sage-hover"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? "Saving..." : isEditMode ? "Save Changes" : "Create Course"}
          </Button>
        </div>
      </div>
    </div>
  );
}
