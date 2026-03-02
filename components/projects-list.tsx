"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ExternalLink } from "lucide-react";

type ProjectsListProps = {
  profileId: string;
  initialProjects: Project[];
};

export function ProjectsList({
  profileId,
  initialProjects,
}: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [adding, setAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    url: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    setAdding(true);
    setError(null);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("projects")
      .insert({
        profile_id: profileId,
        name: newProject.name.trim(),
        description: newProject.description.trim() || null,
        url: newProject.url.trim() || null,
      })
      .select()
      .single();

    setAdding(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setProjects((prev) => [...prev, data as Project]);
    setNewProject({ name: "", description: "", url: "" });
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      {projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{project.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {project.description}
                  </p>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {project.url.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {projects.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No projects yet. Add one below.
        </p>
      )}

      <form onSubmit={handleAdd} className="space-y-4 border rounded-lg p-4 sm:p-5">
        <h3 className="text-sm font-medium">Add a project</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="My app"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-url">URL</Label>
            <Input
              id="project-url"
              value={newProject.url}
              onChange={(e) =>
                setNewProject((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="https://myapp.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-description">Description</Label>
          <Input
            id="project-description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="What does it do?"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Button
            type="submit"
            variant="outline"
            disabled={adding}
            className="w-full sm:w-auto"
          >
            {adding ? "Adding..." : "Add project"}
          </Button>
          {error && <p className="text-sm text-destructive break-words">{error}</p>}
        </div>
      </form>
    </div>
  );
}
