/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/gameupload.hooks.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "sonner";

export function useGameUpload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Action"); 
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [gameFile, setGameFile] = useState<File | null>(null);
  
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = imageFiles.length + files.length;
    if (total > 3) {
      toast.warning("Você pode enviar no máximo 3 imagens");
      return;
    }

    const newImageFiles = [...imageFiles, ...files].slice(0, 3);
    const newPreviews = newImageFiles.map((f) => URL.createObjectURL(f));

    imagePreviews.forEach(URL.revokeObjectURL);
    
    setImageFiles(newImageFiles);
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || imageFiles.length === 0 || !gameFile) {
      toast.warning("Preencha todos os campos obrigatórios (*): título, descrição, pelo menos uma imagem e o arquivo do jogo.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("genre", genre);
      imageFiles.forEach((img) => {
        formData.append("images", img); 
      });
      formData.append("file", gameFile);

      await api.post("/games", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Jogo enviado com sucesso!");
      navigate("/"); 
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || "Falha ao enviar jogo";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [imagePreviews]);

  return {
    title, setTitle,
    description, setDescription,
    genre, setGenre,
    imageFiles,    
    imagePreviews,  
    setGameFile,
    submitting,
    handleImageUpload,
    removeImage,
    handleSubmit,
  };
}