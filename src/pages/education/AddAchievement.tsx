import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import SelectBuilder from "@/components/shared/form-builder/SelecBuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetEducationQuery,
  useUpdateEducationMutation,
} from "@/redux/features/educationApi";
import { z } from "zod";

// Define a schema just for the achievement form
const addAchievementSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type AddAchievementForm = z.infer<typeof addAchievementSchema>;

export default function AddAchievement() {
  const navigate = useNavigate();
  const { data: education, isLoading } = useGetEducationQuery();
  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateEducationMutation();

  const iconOptions = [
    { value: "BookOpen", label: "Book" },
    { value: "Code", label: "Code" },
    { value: "Cpu", label: "CPU" },
    { value: "GraduationCap", label: "Graduation Cap" },
    { value: "Lightbulb", label: "Lightbulb" },
    { value: "Medal", label: "Medal" },
    { value: "Trophy", label: "Trophy" },
    { value: "Zap", label: "Zap" },
  ];

  const onSubmit = async (data: AddAchievementForm) => {
    if (!education) return;

    try {
      // Add the new achievement to the existing ones
      const updatedEducation = {
        ...education,
        achievements: [...(education.achievements || []), data],
      };

      await updateEducation(updatedEducation).unwrap();
      toast.success("Achievement added successfully!");
      navigate("/education");
    } catch (error) {
      console.error("Failed to add achievement:", error);
      toast.error("Failed to add achievement. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          Add Achievement
        </h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <p>Loading education data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          Add Achievement
        </h1>
        <Button variant="outline" onClick={() => navigate("/education")}>
          Back to Education
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Achievement</CardTitle>
          <CardDescription>
            Add a new achievement to your education profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            defaultValues={{
              icon: "",
              title: "",
              description: "",
            }}
            onSubmit={onSubmit}
            resolver={zodResolver(addAchievementSchema)}
            className="space-y-6"
          >
            <SelectBuilder
              label="Icon"
              name="icon"
              placeholder="Select an icon"
              options={iconOptions}
              description="Choose an icon that represents this achievement"
            />

            <InputBuilder
              label="Title"
              name="title"
              placeholder="e.g., Dean's List, Hackathon Winner"
              description="Enter the title of your achievement"
            />

            <InputBuilder
              label="Description"
              name="description"
              placeholder="e.g., Academic Excellence, University Tech Fest"
              description="Provide a brief description of this achievement"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <ButtonBuilder className="w-full sm:w-auto">
                {isUpdating ? "Adding..." : "Add Achievement"}
              </ButtonBuilder>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/education")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </FormBuilder>
        </CardContent>
      </Card>
    </div>
  );
}
