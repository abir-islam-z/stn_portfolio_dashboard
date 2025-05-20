import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import IconPicker from "@/components/shared/icon-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useAddSkillCategoryMutation,
  useGetSkillsCategoriesQuery,
} from "@/redux/features/skillApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISkillCategory, skillsCategorySchema } from "./schema";
import { Input } from "@/components/ui/input";

export default function AddSkillCategory() {
  const [addCategory] = useAddSkillCategoryMutation();
  const { refetch } = useGetSkillsCategoriesQuery();
  const navigate = useNavigate();
  const [icon, setIcon] = useState<string>("");

  const defaultValues = {
    name: "",
    icon: "",
  };

  const onSubmit = async (data: ISkillCategory) => {
    const categoryData = {
      ...data,
      icon: icon || data.icon,
    };

    try {
      await addCategory(categoryData).unwrap();
      refetch();
      navigate("/skills");
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setIcon(iconName);
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Add Skill Category</CardTitle>
        <CardDescription>
          Create a new category for organizing your skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormBuilder
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          resolver={zodResolver(skillsCategorySchema)}
          className="space-y-4"
        >
          <InputBuilder
            name="name"
            label="Category Name"
            placeholder="Enter category name"
            type="text"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Select an Icon</label>
            <IconPicker
              setSelectedIcon={handleIconSelect}
              selectedIcon={icon}
            />
            <p className="text-xs text-muted-foreground">
              Choose an icon that represents this category
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

          <ButtonBuilder>Add Category</ButtonBuilder>
        </FormBuilder>
      </CardContent>
    </Card>
  );
}
