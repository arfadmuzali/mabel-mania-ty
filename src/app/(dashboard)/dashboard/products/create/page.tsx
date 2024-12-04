"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { base } from "@uploadcare/upload-client";
import Image from "next/image";
import { useCallback, useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than zero")
    .required("Price is required"),
  // categoryId: Yup.array()
  //   .of(Yup.number().required("Category is required"))
  //   .min(1, "At least one category is required"),
  description: Yup.string().required("Description is required"),
});

async function getCategories() {
  const response = await axios.get("/api/categories");
  return response.data;
}

export default function DashboardCreateProductPage() {
  const router = useRouter();

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newImages = Array.from(files)
          .slice(0, 3 - images.length)
          .map((file) => file);
        setPreview((prevImages) =>
          [
            ...prevImages,
            ...newImages.map((val) => URL.createObjectURL(val)),
          ].slice(0, 3)
        );
        setImages((prevImages) => [...prevImages, ...newImages].slice(0, 3));
      }
    },
    [images]
  );

  const removeImage = useCallback((index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreview((prevImages) => prevImages.filter((_, i) => i !== index));
  }, []);

  const [selectedCategories, setSelectedCategories] =
    useState<string>("others");

  const { data: categories } = useQuery({
    queryFn: getCategories,
    queryKey: ["categories"],
    gcTime: 60000000,
    staleTime: 59000000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      images: string[];
      categorySlug: string | null;
      name: string;
      price: string;
      description: string;
    }) => {
      console.log(data);
      const response = await axios.post("/api/dashboard/products", data);
      return response.data;
    },
  });

  return (
    <div className="border space-y-4 shadow-md rounded-lg p-4">
      <div>
        <h1 className="text-xl font-bold">Add product</h1>
        <p className="text-sm font">Add a new product for your store</p>
      </div>

      <Formik
        initialValues={{
          name: "",
          price: "",
          // categoryId: "",
          description: "",
        }}
        validationSchema={ProductSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          try {
            if (images.length <= 0) {
              toast("Please fill the iamge at least one");
              setSubmitting(false);
              return;
            }

            const imageUrls: string[] = await Promise.all(
              images.map(async (val) => {
                const upload = await base(val, {
                  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
                  store: "auto",
                });
                return upload.file;
              })
            );

            console.log(imageUrls);

            const payload = {
              ...values,
              images: imageUrls,
              categorySlug: selectedCategories,
            };
            await createMutation.mutateAsync(payload, {
              onSuccess: () => {
                toast("Tour created successfully!");
                router.push("/dashboard/products");
              },
              onError: (error: Error) => {
                toast(`Error creating tour: ${error.message}`);
              },
              onSettled: () => {
                setSubmitting(false);
              },
            });
          } catch (error) {
            console.log(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 lg:w-3/5">
            <div>
              <label className="block font-medium">Name</label>
              <Field
                type="text"
                name="name"
                className="border p-2 w-full"
                placeholder="Type product name here"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <Field
                as="textarea"
                name="description"
                className="border p-2 w-full"
                rows={5}
                placeholder="Enter description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex gap-4 w-full bg-red-">
              <div className="w-full">
                <label className="block font-medium">Price</label>
                <Field
                  type="number"
                  name="price"
                  className="border p-2 w-full"
                  placeholder="Enter price"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className=" w-full">
                <label className="block font-medium">Categories</label>
                <Select
                  value={selectedCategories}
                  onValueChange={(e) => {
                    // console.log(e);
                    setSelectedCategories(e);
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories?.map((category: Category, index: number) => {
                        return (
                          <SelectItem key={index} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold">Images</h2>
                  <p className="text-sm text-gray-500">
                    {images.length}/3 images
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {preview.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="relative w-full h-32">
                        <Image
                          src={image}
                          alt={`Uploaded ${index + 1}`}
                          fill
                          className="w-full h-32 object-cover rounded-md object-center"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        type="button"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 3 && (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="text-gray-600">+ Add Image</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="w-full"
            >
              {isSubmitting || createMutation.isPending
                ? "Submitting..."
                : "Create Tour"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
