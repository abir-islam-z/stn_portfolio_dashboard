import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import DashboardSkeleton from "@/components/shared/dashboard-skeleton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import ErrorComponent from "@/components/shared/error-component";
import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import FileInputBuilder from "@/components/shared/form-builder/FileInputBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import { SocialLink } from "@/components/shared/SocialLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/features/profileApi";
import { Github, Linkedin, Twitter } from "lucide-react";
import { IProfileForm, profileSchema } from "./schema";

export default function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const onSubmit = async (data: IProfileForm) => {
    try {
      const formData = {
        ...data,
        // Only include thumbnail if it's been updated
        thumbnail:
          data.thumbnail && data.thumbnail.length > 0
            ? data.thumbnail[0]
            : undefined,
        // Include resumeFile as a URL
        resumeFile: data.resumeFile || undefined,
      };

      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  }; // Prepare form default values
  const getDefaultValues = () => {
    if (!profile) return {};

    return {
      name: profile.name || "",
      title: profile.title || "",
      experience: profile.experience || "",
      thumbnail: [], // Empty array as we don't have the File objects
      resumeFile: profile.resumeFile || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      twitter: profile.twitter || "",
    };
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !profile) {
    return (
      <ErrorComponent
        title="Profile"
        message="Failed to load profile data."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neon-text">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and social links
        </p>
      </div>

      {/* Profile Preview Card */}
      <Card className="dashboard-card overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle>Profile Preview</CardTitle>
          <CardDescription>
            How your profile appears to visitors
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage
                src={profile.thumbnail}
                alt={profile.name || "Profile"}
              />
              <AvatarFallback className="text-3xl">
                {profile.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-3 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.title}</p>
                <p className="text-sm text-primary">{profile.experience}</p>
              </div>

              <div className="flex gap-2 justify-center md:justify-start">
                <SocialLink
                  href={profile.github}
                  icon={<Github size={18} />}
                  label="GitHub"
                />
                <SocialLink
                  href={profile.linkedin}
                  icon={<Linkedin size={18} />}
                  label="LinkedIn"
                />
                <SocialLink
                  href={profile.twitter}
                  icon={<Twitter size={18} />}
                  label="Twitter"
                />
              </div>

              <div className="mt-2">
                <DownloadButton
                  fileUrl={profile.resumeFile}
                  fileName="Resume.pdf"
                  className="text-sm"
                >
                  Download Resume
                </DownloadButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your profile information and social media links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            defaultValues={getDefaultValues()}
            onSubmit={onSubmit}
            resolver={zodResolver(profileSchema)}
            className="space-y-4"
          >
            <InputBuilder
              name="name"
              label="Name"
              placeholder="Your name"
              type="text"
            />

            <InputBuilder
              name="title"
              label="Title"
              placeholder="e.g., Senior Software Engineer, UI/UX Designer"
              type="text"
            />

            <InputBuilder
              name="experience"
              label="Experience"
              placeholder="e.g., 5+ Years Experience"
              type="text"
            />

            <div>
              <FileInputBuilder
                name="thumbnail"
                label="Profile Image"
                maxFileCount={1}
                className="mt-2"
              />
              <div className="flex flex-col space-y-1 mt-1">
                <p className="text-xs text-muted-foreground">
                  Upload a new image only if you want to replace the current
                  one.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Current image:</span>
                  {profile.thumbnail ? (
                    <span className="text-xs bg-muted px-2 py-1 rounded-md inline-flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary/20 rounded-full flex-shrink-0" />
                      {profile.thumbnail.split("/").pop() || "profile-image"}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <InputBuilder
                name="resumeFile"
                label="Resume / CV URL"
                placeholder="https://example.com/your-resume.pdf"
                type="url"
                description="Enter a direct link to your resume file (PDF, DOC, DOCX recommended)"
              />
              {profile.resumeFile && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Current resume link:
                  </p>
                  <DownloadButton
                    fileUrl={profile.resumeFile}
                    className="text-xs h-8"
                    iconSize={14}
                  >
                    {profile.resumeFile.split("/").pop() || "Download Resume"}
                  </DownloadButton>
                </div>
              )}
            </div>

            <InputBuilder
              name="github"
              label="GitHub Profile"
              placeholder="https://github.com/yourusername"
              type="url"
            />

            <InputBuilder
              name="linkedin"
              label="LinkedIn Profile"
              placeholder="https://linkedin.com/in/yourusername"
              type="url"
            />

            <InputBuilder
              name="twitter"
              label="Twitter Profile"
              placeholder="https://twitter.com/yourusername"
              type="url"
            />

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <ButtonBuilder className="w-full sm:w-auto">
                {isUpdating ? "Updating..." : "Update Profile"}
              </ButtonBuilder>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  refetch().then(() => {
                    toast.info(
                      "Profile form has been reset to the original values."
                    );
                  })
                }
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                Reset Changes
              </Button>

              {isUpdating && (
                <p className="text-xs text-muted-foreground mt-2">
                  Please wait while your profile is being updated...
                </p>
              )}
            </div>
          </FormBuilder>
        </CardContent>
      </Card>
    </div>
  );
}
