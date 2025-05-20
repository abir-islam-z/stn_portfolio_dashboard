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
import {
  useAddSkillTechnologyMutation,
  useGetSkillsCategoriesQuery,
} from "@/redux/features/skillApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISkillTechnology, skillsTechnologySchema } from "./schema";

export default function AddSkill() {
  const [addSkill] = useAddSkillTechnologyMutation();
  const { data: categories } = useGetSkillsCategoriesQuery();
  const navigate = useNavigate();
  const [icon, setIcon] = useState<string>("");

  const defaultValues = {
    name: "",
    icon: "",
    category: "",
  };

  const onSubmit = async (data: ISkillTechnology) => {
    // Use the selected icon or the one in the form data
    const skillData = {
      ...data,
      icon: icon || data.icon,
    };

    try {
      await addSkill(skillData).unwrap();
      navigate("/skills");
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setIcon(iconName);
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Add New Skill</CardTitle>
        <CardDescription>
          Add a new skill or technology to your portfolio
        </CardDescription>
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

          <ButtonBuilder>Add Skill</ButtonBuilder>
        </FormBuilder>
      </CardContent>
    </Card>
  );
}
