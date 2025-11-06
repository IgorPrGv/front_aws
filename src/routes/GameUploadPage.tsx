// src/routes/GameUploadPage.tsx  (ou src/pages/GameUploadPage.tsx)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Upload as UploadIcon, X } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { api } from "../lib/axios";

export function GameUploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Action");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [gameFile, setGameFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 🔐 Apenas DEV
  if (!user) {
    navigate("/login");
    return null;
  }
  if (user.userType !== "DEV") {
    navigate("/");
    return null;
  }

  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = imageFiles.length + files.length;
    if (total > 3) {
      alert("Você pode enviar no máximo 3 imagens");
      return;
    }
    const newImageFiles = [...imageFiles, ...files].slice(0, 3);
    setImageFiles(newImageFiles);
    setImagePreviews(newImageFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || imageFiles.length === 0) {
      alert("Preencha título, descrição e envie pelo menos uma imagem");
      return;
    }

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("genre", genre);
    imageFiles.forEach((img) => fd.append("images", img));
    if (gameFile) fd.append("file", gameFile);

    try {
      setSubmitting(true);
      await api.post("/games", fd, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Jogo enviado com sucesso!");
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || "Falha ao enviar jogo";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Upload de Jogo</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Preencha os campos abaixo para enviar seu jogo ao portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Digite o título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                placeholder="Descreva seu jogo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Gênero */}
            <div className="space-y-2">
              <Label htmlFor="genre">Gênero *</Label>
              <select
                id="genre"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option>Action</option>
                <option>Adventure</option>
                <option>RPG</option>
                <option>Strategy</option>
                <option>Puzzle</option>
                <option>Racing</option>
                <option>Sports</option>
                <option>Simulation</option>
              </select>
            </div>

            {/* Imagens */}
            <div className="space-y-2">
              <Label>Imagens * (até 3)</Label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((p, i) => (
                  <div
                    key={i}
                    className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                  >
                    <img src={p} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {imageFiles.length < 3 && (
                  <label className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <div className="text-center">
                      <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Adicionar imagem</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" multiple />
                  </label>
                )}
              </div>
            </div>

            {/* Arquivo do jogo  */}
            <div className="space-y-2">
              <Label htmlFor="gamefile">Arquivo do jogo (opcional)</Label>
              <Input
                id="gamefile"
                type="file"
                onChange={(e) => setGameFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
