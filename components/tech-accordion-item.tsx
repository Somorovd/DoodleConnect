import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { ReactNode } from "react";

type TechAccordionIconProps = {
  tech: string;
  children: ReactNode;
};

const TechAccordionIcon = ({ tech, children }: TechAccordionIconProps) => {
  return (
    <AccordionItem value={tech}>
      <AccordionTrigger>{tech}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
};

export default TechAccordionIcon;
