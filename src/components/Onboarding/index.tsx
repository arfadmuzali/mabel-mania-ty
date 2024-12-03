"use client";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { LoadingSpinner } from "../ui/loadingSpinner";

export const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required") // Kolom wajib diisi
    .min(3, "Name must be at least 3 characters") // Minimal 3 karakter
    .max(50, "Name must not exceed 50 characters"), // Maksimal 50 karakter
  description: Yup.string()
    .required("Description is required") // Kolom wajib diisi
    .min(10, "Description must be at least 10 characters") // Minimal 10 karakter
    .max(200, "Description must not exceed 200 characters"), // Maksimal 200 karakter
});

export default function Onboarding() {
  const router = useRouter();
  const search = useSearchParams();
  const step = search.get("step");

  const onboardingMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const response = await axios.post("/api/stores", data);
      return response.data;
    },
    onSuccess: async () => {
      router.push("/dashboard");
    },
    onError: async () => {
      toast("an error occured");
    },
  });

  const initialValues = {
    name: "",
    description: "",
  };

  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    await onboardingMutation.mutateAsync({
      name: values.name,
      description: values.description,
    });
  };
  return (
    <AnimatePresence mode="wait">
      {!step && (
        <motion.div
          key={"idex"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 rounded-md p-5 gap-3 flex flex-col items-center backdrop-blur-sm"
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-center"
          >
            Welcome to Mabel Mania Store
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
            className="md:max-w-[40vw] text-center mb-4 text-sm font-semibold text-neutral-700"
          >
            Get started with your new store in just a few steps and start
            selling your products online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.7 }}
          >
            <Button
              onClick={() => {
                router.push("?step=store");
              }}
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      )}
      {step == "store" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 rounded-md p-5 gap-2 flex flex-col items-center backdrop-blur-sm"
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Let{"'"}s start by giving your store a name
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
            className="md:max-w-[40vw] text-start mb-4 text-sm font-semibold text-neutral-700"
          >
            You can update your store name and description later
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Field
                      className="flex h-10 w-full rounded-md bg-white px-3 py-2 text-base file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:outline-none focus:border-0 border-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-600 text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Field
                      className="flex h-10 w-full rounded-md bg-white px-3 py-2 text-base file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:outline-none focus:border-0 border-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 min-h-24"
                      id="description"
                      name="description"
                      placeholder="Enter your description"
                      as="textarea"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-600 text-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || onboardingMutation.isPending}
                  >
                    {isSubmitting || onboardingMutation.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <span>Submit</span>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
