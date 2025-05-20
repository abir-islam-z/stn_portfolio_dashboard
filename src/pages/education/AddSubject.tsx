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

// Define a schema just for this form
const addSubjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  icon: z.string().min(1, "Icon is required"),
});

type AddSubjectForm = z.infer<typeof addSubjectSchema>;

export default function AddSubject() {
  const navigate = useNavigate();
  const { data: education, isLoading } = useGetEducationQuery();
  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateEducationMutation();

  const iconOptions = [
    { value: "Code", label: "Code" },
    { value: "Cpu", label: "CPU" },
    { value: "Database", label: "Database" },
    { value: "Network", label: "Network" },
    { value: "Globe", label: "Globe" },
    { value: "Settings", label: "Settings" },
    { value: "BarChart", label: "Analytics" },
    { value: "FileText", label: "Document" },
  ];

  const onSubmit = async (data: AddSubjectForm) => {
    if (!education) return;

    try {
      // Add the new subject to the existing ones
      const updatedEducation = {
        ...education,
        subjects: [...(education.subjects || []), data],
      };

      await updateEducation(updatedEducation).unwrap();
      toast.success("Subject added successfully!");
      navigate("/education");
    } catch (error) {
      console.error("Failed to add subject:", error);
      toast.error("Failed to add subject. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          Add Key Subject
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
          Add Key Subject
        </h1>
        <Button variant="outline" onClick={() => navigate("/education")}>
          Back to Education
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Key Subject</CardTitle>
          <CardDescription>
            Add a new key subject to your education profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            defaultValues={{
              name: "",
              icon: "",
            }}
            onSubmit={onSubmit}
            resolver={zodResolver(addSubjectSchema)}
            className="space-y-6"
          >
            <InputBuilder
              label="Subject Name"
              name="name"
              placeholder="e.g., Algorithms & Data Structures, Web Development"
              description="Enter the name of the subject you excelled in"
            />

            <SelectBuilder
              label="Icon"
              name="icon"
              placeholder="Select an icon"
              options={iconOptions}
              description="Choose an icon that represents this subject"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <ButtonBuilder className="w-full sm:w-auto">
                {isUpdating ? "Adding..." : "Add Subject"}
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
