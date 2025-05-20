import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "@/layouts/app-layout";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { AuthGuard } from "./components/auth-guard";
import AboutPage from "./pages/about";
import LoginPage from "./pages/auth/login";
import DashboardPage from "./pages/dashboard";
import EducationPage from "./pages/education";
import AddAchievement from "./pages/education/AddAchievement";
import AddCourse from "./pages/education/AddCourse";
import AddSubject from "./pages/education/AddSubject";
import ExperiencePage from "./pages/experience";
import AddExperience from "./pages/experience/AddExperience";
import EditExperience from "./pages/experience/EditExperience";
import ProfilePage from "./pages/profile";
import ProjectsPage from "./pages/projects";
import AddProjects from "./pages/projects/AddProject";
import EditProject from "./pages/projects/EditProject";
import SkillsPage from "./pages/skills";
import AddSkill from "./pages/skills/AddSkill";
import AddSkillCategory from "./pages/skills/AddSkillCategory";
import EditSkill from "./pages/skills/EditSkill";

// Pages

const router = createBrowserRouter([
  {
    path: "/",
    Component: () => (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, Component: DashboardPage },
      {
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "about",
        Component: AboutPage,
      },
      {
        path: "education",
        children: [
          { index: true, Component: EducationPage },
          {
            path: "add/achievement",
            Component: AddAchievement,
          },
          {
            path: "add/subject",
            Component: AddSubject,
          },
          {
            path: "add/course",
            Component: AddCourse,
          },
        ],
      },
      {
        path: "projects",
        children: [
          { index: true, Component: ProjectsPage },
          {
            path: "add",
            Component: AddProjects,
          },
          {
            path: "edit/:id",
            Component: EditProject,
          },
        ],
      },
      {
        path: "experience",
        children: [
          { index: true, Component: ExperiencePage },
          {
            path: "add",
            Component: AddExperience,
          },
          {
            path: "edit/:id",
            Component: EditExperience,
          },
        ],
      },
      {
        path: "skills",
        children: [
          { index: true, Component: SkillsPage },
          {
            path: "add",
            Component: AddSkill,
          },
          {
            path: "edit/:id",
            Component: EditSkill,
          },
          {
            path: "add-category",
            Component: AddSkillCategory,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider defaultTheme="dark">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
