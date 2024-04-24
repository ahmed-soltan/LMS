"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  coursePrice: number;
}

const CourseEnrollButton = ({
  coursePrice,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      console.log(response.data);
      window.location.assign(response.data.url);
    } catch (error) {
      console.log(error);
      toast.error("Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button className="w-full md:w-auto" size={"sm"} onClick={onClick} disabled={isLoading}>
      Enroll For {formatPrice(coursePrice)}
    </Button>
  );
};

export default CourseEnrollButton;
