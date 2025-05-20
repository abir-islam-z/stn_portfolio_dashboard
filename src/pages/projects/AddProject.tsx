import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import FileInputBuilder from "@/components/shared/form-builder/FileInputBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import RepeatableFieldBuilder from "@/components/shared/form-builder/RepeatableFieldBuilder";
import RichTextEditorBuilder from "@/components/shared/form-builder/RichTextEditorBuilder";
import SelectBuilder from "@/components/shared/form-builder/SelecBuilder";
import SwitchBuilder from "@/components/shared/form-builder/SwitchBuilder";
import TagInputBuilder from "@/components/shared/form-builder/TagInputBuilder";
import {
  Card as CardComponent,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAddProjectMutation } from "@/redux/features/projectApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { IProjectCreate, projectSchema } from "./schema";

export default function AddProjects() {
  const [addProject] = useAddProjectMutation();
  const defaultValues = {
    title: "",
    description: "<p>Enter your project description here...</p>",
    image: [] as File[],
    category: "web",
    tags: [],
    demoUrl: "",
    repoUrl: "",
    features: [],
    isFeatured: false,
  };

  const onSubmit = async (data: IProjectCreate) => {
    // The data is now transformed by Zod to have features as string array
    console.log(data);
    await addProject(data).unwrap();
  };

  return (
    <CardComponent className="dashboard-card">
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
        <CardDescription>
          Fill in the details of your project below. Make sure to provide a
          clear description and relevant tags to help others find your project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormBuilder
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          resolver={zodResolver(projectSchema)}
          className="space-y-4"
        >
          {/* Form fields go here */}
          <InputBuilder
            name="title"
            label="Project Title"
            placeholder="Enter project title"
            type="text"
          />

          <div className="space-y-2">
            <RichTextEditorBuilder
              name="description"
              label="Project Description"
              placeholder="Write a detailed description of your project..."
            />
            <p className="text-xs text-muted-foreground">
              Use the toolbar above to format your text, add links, lists, and
              more. You can also add images by URL.
            </p>
          </div>

          <FileInputBuilder
            name="image"
            label="Project Image"
            maxFileCount={2}
            className="mt-2"
          />

          <SelectBuilder
            name="category"
            label="Project Category"
            className="mt-2"
            options={[
              { value: "web", label: "Web" },
              { value: "mobile", label: "Mobile" },
              { value: "desktop", label: "Desktop" },
            ]}
          />

          <TagInputBuilder
            name="tags"
            label="Project Technologies"
            placeholder="Type technologies like 'React, TypeScript, Redux' and press Enter"
            showHelper={true}
          />

          <InputBuilder
            name="demoUrl"
            label="Demo URL"
            placeholder="Enter demo URL"
            type="url"
          />

          <InputBuilder
            name="repoUrl"
            label="Repository URL"
            placeholder="Enter repository URL"
            type="url"
          />

          <RepeatableFieldBuilder
            name="features"
            label="Project Features"
            defaultItem={{
              feature: "",
            }}
            maxItems={5}
            renderField={(name, index) => (
              <InputBuilder
                name={`${name}.feature`}
                label={`Feature ${index + 1}`}
                placeholder="Enter feature"
                type="text"
              />
            )}
          />

          <SwitchBuilder
            name="isFeatured"
            description="If this project is featured, it will be highlighted on the homepage."
            label="Is this project featured?"
            className="mt-2"
          />

          <ButtonBuilder>Add Project</ButtonBuilder>
        </FormBuilder>
      </CardContent>
    </CardComponent>
  );
}
