import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import SelectBuilder from "@/components/shared/form-builder/SelecBuilder";
import IconPicker from "@/components/shared/icon-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetSkillTechnologyByIdQuery,
  useGetSkillsCategoriesQuery,
  useUpdateSkillTechnologyMutation,
} from "@/redux/features/skillApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ISkillTechnology, skillsTechnologySchema } from "./schema";

export default function EditSkill() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [icon, setIcon] = useState<string>("");

  const {
    data: skill,
    isLoading,
    isError,
  } = useGetSkillTechnologyByIdQuery(Number(id));
  const { data: categories } = useGetSkillsCategoriesQuery();
  const [updateSkill] = useUpdateSkillTechnologyMutation();

  useEffect(() => {
    if (skill) {
      setIcon(skill.icon);
    }
  }, [skill]);

  const defaultValues = {
    name: skill?.name || "",
    icon: skill?.icon || "",
    category: skill?.category || "",
  };

  const onSubmit = async (data: ISkillTechnology) => {
    if (!skill) return;

    const skillData = {
      ...data,
      id: skill.id,
      icon: icon || data.icon,
    };

    try {
      await updateSkill(skillData).unwrap();
      navigate("/skills");
    } catch (error) {
      console.error("Failed to update skill:", error);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setIcon(iconName);
  };

  if (isLoading) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !skill) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load skill details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Could not load the skill. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Edit Skill</CardTitle>
        <CardDescription>Update skill or technology details</CardDescription>
      </CardHeader>
      <CardContent>
        <FormBuilder
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          resolver={zodResolver(skillsTechnologySchema)}
          className="space-y-4"
        >
          <InputBuilder
            name="name"
            label="Skill Name"
            placeholder="Enter skill name"
            type="text"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Select an Icon</label>
            <IconPicker
              setSelectedIcon={handleIconSelect}
              selectedIcon={icon}
            />
            <p className="text-xs text-muted-foreground">
              Choose an icon that represents your skill
            </p>
          </div>

          <Input
            name="icon"
            // label="Icon Name (or custom icon)"
            placeholder="Enter icon name if not selected above"
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />

          <SelectBuilder
            name="category"
            label="Skill Category"
            placeholder="Select a category"
            options={
              categories?.map((cat) => ({
                value: cat.name,
                label: cat.name,
              })) || []
            }
          />

          <ButtonBuilder>Update Skill</ButtonBuilder>
        </FormBuilder>
      </CardContent>
    </Card>
  );
}
