import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import React, { ReactNode } from "react";

type TechAccordionIconProps = {
  tech: string;
  link: string;
  children: ReactNode;
};

const TechAccordionIcon = ({
  tech,
  link,
  children,
}: TechAccordionIconProps) => {
  return (
    <AccordionItem value={tech}>
      <AccordionTrigger>{tech}</AccordionTrigger>
      <AccordionContent>
        {children}
        <Link href={link} className="text-blue-500 mt-2 hover:underline">
          More Information
        </Link>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TechAccordionIcon;
