import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBlogPostsQuery } from "@/redux/features/blogApi";
import { useGetProfileQuery } from "@/redux/features/profileApi";
import { useGetProjectsQuery } from "@/redux/features/projectApi";
import { useGetSkillsTechnologiesQuery } from "@/redux/features/skillApi";

import { Briefcase, Code, FileText, User } from "lucide-react";
import type React from "react";

export default function DashboardPage() {
  const { isLoading: isLoadingProfile } = useGetProfileQuery();
  const { data: projects, isLoading: isLoadingProjects } =
    useGetProjectsQuery();
  const { data: skills, isLoading: isLoadingSkills } =
    useGetSkillsTechnologiesQuery();
  const { data: blogPosts, isLoading: isLoadingBlogPosts } =
    useGetBlogPostsQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to your portfolio dashboard. Manage your content from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Profile"
          description="Your personal information"
          icon={User}
          value={isLoadingProfile ? null : "1"}
          href="/profile"
        />
        <DashboardCard
          title="Projects"
          description="Your portfolio projects"
          icon={Briefcase}
          value={isLoadingProjects ? null : projects?.length?.toString()}
          href="/projects"
        />
        <DashboardCard
          title="Skills"
          description="Your technical skills"
          icon={Code}
          value={isLoadingSkills ? null : skills?.length?.toString()}
          href="/skills"
        />
        <DashboardCard
          title="Blog Posts"
          description="Your published articles"
          icon={FileText}
          value={isLoadingBlogPosts ? null : blogPosts?.length?.toString()}
          href="/blog"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="dashboard-card col-span-2">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your most recent portfolio projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProjects ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="space-y-2">
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center p-2 rounded-md hover:bg-muted"
                  >
                    <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center mr-3">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.tags.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No projects found. Add your first project.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
            <CardDescription>Your latest articles</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBlogPosts ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : blogPosts && blogPosts.length > 0 ? (
              <div className="space-y-2">
                {blogPosts.slice(0, 2).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center p-2 rounded-md hover:bg-muted"
                  >
                    <div className="h-10 w-10 rounded bg-secondary/20 flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.publishedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No blog posts found. Write your first article.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  value: string | null | number | undefined;
  href: string;
};

function DashboardCard({
  title,
  description,
  icon: Icon,
  value,
}: DashboardCardProps) {
  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
