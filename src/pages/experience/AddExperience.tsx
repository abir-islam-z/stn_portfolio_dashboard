import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import RepeatableFieldBuilder from "@/components/shared/form-builder/RepeatableFieldBuilder";
import TextAreaBuilder from "@/components/shared/form-builder/TextAreaBuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAddExperienceMutation } from "@/redux/features/experienceApi";
import { experienceSchema, IExperience } from "./schema";

export default function AddExperience() {
  const navigate = useNavigate();
  const [addExperience] = useAddExperienceMutation();

  const onSubmit = async (data: IExperience) => {
    try {
      await addExperience(data).unwrap();
      toast.success("Job experience added successfully!");
      navigate("/experience");
    } catch (error) {
      console.error("Failed to add job:", error);
      toast.error("Failed to add job experience. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          Add Experience
        </h1>
        <Button variant="outline" onClick={() => navigate("/experience")}>
          Back to Experience
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Job Experience</CardTitle>
          <CardDescription>Add a new job to your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            defaultValues={{
              position: "",
              company: "",
              location: "",
              period: "",
              description: "",
              responsibilities: [""],
            }}
            onSubmit={onSubmit}
            resolver={zodResolver(experienceSchema)}
            className="space-y-6"
          >
            <InputBuilder
              label="Position"
              name="position"
              placeholder="e.g., Senior Software Engineer"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputBuilder
                label="Company"
                name="company"
                placeholder="e.g., Tech Corp Inc."
              />
              <InputBuilder
                label="Location"
                name="location"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <InputBuilder
              label="Period"
              name="period"
              placeholder="e.g., Jan 2020 - Present"
            />

            <TextAreaBuilder
              label="Job Description"
              name="description"
              placeholder="Write a brief description of your role and achievements..."
              rows={3}
            />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Key Responsibilities</h4>
              <RepeatableFieldBuilder
                name="responsibilities"
                addButtonLabel="Add Responsibility"
                className="space-y-2"
                renderField={(field) => (
                  <InputBuilder
                    name={field}
                    placeholder="e.g., Led a team of 5 developers in building a new product feature"
                  />
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <ButtonBuilder className="w-full sm:w-auto">
                Add Experience
              </ButtonBuilder>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/experience")}
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
