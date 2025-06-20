
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const ProductForm = ({ isOpen, onClose, onSubmit, initialData, editingProduct, isSubmitting }) => {
  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(initialData);
    if (initialData.imagem && !initialData.imagemFile) {
      setImagePreview(initialData.imagem);
    } else if (initialData.imagemFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(initialData.imagemFile);
    } else {
      setImagePreview(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast({
          title: "Imagem muito grande! 🖼️",
          description: "Por favor, selecione uma imagem menor que 2MB.",
          variant: "destructive"
        });
        if(fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
        return;
      }
      setFormData(prev => ({ ...prev, imagemFile: file, imagem: '' }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.preco || !formData.categoria || !formData.tipo || formData.estoque === '') {
      toast({
        title: "Erro de validação 🚨",
        description: "Nome, preço, categoria, tipo e estoque são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const estoqueValue = parseInt(formData.estoque, 10);
    if (isNaN(estoqueValue) || estoqueValue < 0) {
       toast({
        title: "Erro de validação 🚨",
        description: "Estoque deve ser um número positivo.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.imagemFile && !formData.imagem && !editingProduct) {
       toast({
        title: "Erro de validação 🚨",
        description: "Uma imagem é obrigatória para novos produtos.",
        variant: "destructive"
      });
      return;
    }
    
    const productData = {
      ...formData,
      preco: parseFloat(formData.preco),
      estoque: estoqueValue,
    };
    onSubmit(productData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-card rounded-xl p-8 mb-10 shadow-xl border border-border overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-foreground">
          {editingProduct ? 'Editar Produto Esportivo' : 'Cadastrar Novo Produto'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground hover:bg-muted" disabled={isSubmitting}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="nome" className="text-foreground/90">Nome do Produto *</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring"
              placeholder="Ex: Tênis de Corrida Pro"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="preco" className="text-foreground/90">Preço (R$) *</Label>
            <Input
              id="preco"
              name="preco"
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={handleChange}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring"
              placeholder="199.90"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="estoque" className="text-foreground/90">Estoque *</Label>
            <Input
              id="estoque"
              name="estoque"
              type="number"
              value={formData.estoque}
              onChange={handleChange}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring"
              placeholder="50"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="categoria" className="text-foreground/90">Categoria *</Label>
            <Select name="categoria" value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value, tipo: value === 'bermudas' ? 'bermuda' : formData.tipo })} disabled={isSubmitting}>
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-ring">
                <SelectValue placeholder="Selecione a Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="camisas" className="hover:bg-accent focus:bg-accent">Camisas</SelectItem>
                <SelectItem value="calcados" className="hover:bg-accent focus:bg-accent">Calçados</SelectItem>
                <SelectItem value="bermudas" className="hover:bg-accent focus:bg-accent">Bermudas</SelectItem>
                <SelectItem value="acessorios" className="hover:bg-accent focus:bg-accent">Acessórios</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tipo" className="text-foreground/90">Tipo de Produto *</Label>
            <Select name="tipo" value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })} disabled={isSubmitting || formData.categoria === 'bermudas'}>
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-ring">
                <SelectValue placeholder="Selecione o Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="camisa" className="hover:bg-accent focus:bg-accent">Camisa (PP-GG)</SelectItem>
                <SelectItem value="calcado" className="hover:bg-accent focus:bg-accent">Calçado (36-44)</SelectItem>
                <SelectItem value="bermuda" className="hover:bg-accent focus:bg-accent">Bermuda (P-GG / 34-44)</SelectItem>
                <SelectItem value="acessorio" className="hover:bg-accent focus:bg-accent">Acessório (Tamanho Único)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="imagemFile" className="text-foreground/90">Imagem do Produto {editingProduct ? '(Opcional para manter atual)' : '*'}</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md bg-background hover:border-primary transition-colors">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Pré-visualização" className="mx-auto h-32 w-auto object-contain rounded-md" />
              ) : (
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              )}
              <div className="flex text-sm text-muted-foreground">
                <label
                  htmlFor="imagemFile"
                  className={`relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>Carregar um arquivo</span>
                  <Input id="imagemFile" name="imagemFile" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" ref={fileInputRef} disabled={isSubmitting} />
                </label>
                <p className="pl-1">ou arraste e solte</p>
              </div>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP até 2MB</p>
              {formData.imagemFile && <p className="text-xs text-green-600 pt-1">{formData.imagemFile.name}</p>}
            </div>
          </div>
           {editingProduct && formData.imagem && !formData.imagemFile && (
            <p className="text-xs text-muted-foreground mt-1">Imagem atual: <a href={formData.imagem} target="_blank" rel="noopener noreferrer" className="text-primary underline">{formData.imagem.substring(0,30)}...</a></p>
          )}
        </div>


        <div>
          <Label htmlFor="descricao" className="text-foreground/90">Descrição</Label>
          <Textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring min-h-[100px]"
            placeholder="Detalhes do produto, materiais, tecnologias..."
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-4 pt-2">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 min-w-[180px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-border text-foreground hover:bg-muted hover:border-ring hover:text-ring py-3 px-6"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;
