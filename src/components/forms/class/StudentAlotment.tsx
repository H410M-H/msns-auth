"use client"

import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type AllotmentDialogProps = {
  classId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
  studentId: z.string({ required_error: "Student is required" }),
  sessionId: z.string({ required_error: "Session is required" }),
});

export const AllotmentDialog = ({ 
  classId,
  open,
  onOpenChange
}: AllotmentDialogProps) => {  const [searchTerm, setSearchTerm] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const utils = api.useUtils();
  const { data: sessions } = api.session.getSessions.useQuery();
  const { data: students } = api.student.getUnAllocateStudents.useQuery({
    searchTerm,
  });

  const allotment = api.alotment.addToClass.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.student.getUnAllocateStudents.invalidate();
      onOpenChange(false); // Add this line
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    allotment.mutate({
      classId,
      sessionId: values.sessionId,
      studentId: values.studentId,
    });
  };

  return (
<Dialog open={open} onOpenChange={onOpenChange}>      <DialogTrigger asChild>
        <Button>Add Student to Class</Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Allot Student to Class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Student</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={allotment.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                      {students?.data.map((student) => (
                        <SelectItem
                          key={student.studentId}
                          value={student.studentId}
                        >
                          {student.studentName} ({student.fatherName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Session</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={allotment.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sessions?.map((session) => (
                        <SelectItem
                          key={session.sessionId}
                          value={session.sessionId}
                        >
                          {session.sessionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={allotment.isPending}
              className="w-full"
            >
              {allotment.isPending ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Allot Student"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};