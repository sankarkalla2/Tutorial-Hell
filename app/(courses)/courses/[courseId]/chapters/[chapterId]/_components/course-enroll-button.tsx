"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency-format";
import prisma from "@/lib/db";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
  userId: string;
}

const CourseEnrollButton = ({
  courseId,
  price,
  userId,
}: CourseEnrollButtonProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const onClick = async () => {
    try {
      setIsUpdating(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);

      window.location.assign(response.data.url);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while checkout");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <Button
      onClick={onClick}
      disabled={isUpdating}
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
