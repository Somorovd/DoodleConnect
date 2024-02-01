"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModalType, useModal } from "@/hooks/use-modal";
import { UserButton, redirectToSignIn, useUser } from "@clerk/nextjs";
import { Accordion } from "@/components/ui/accordion";
import { CircleUserRound, CodeSquare, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import TechAccordionIcon from "@/components/tech-accordion-item";

export default function Home() {
  const { isLoaded, user: self } = useUser();
  const onOpen = useModal((state) => state.onOpen);

  const handleCreate = () => {
    onOpen(ModalType.CreateLobby);
  };

  const handleJoin = () => {
    onOpen(ModalType.JoinLobby);
  };

  if (!isLoaded) {
    return null;
  } else if (!self) {
    redirectToSignIn();
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <header className="mb-4">
        <h1 className="text-[4rem] text-center">DoodleConnect</h1>
        <h2 className="text-[2rem] text-center">
          Chat with friends while making silly art
        </h2>
      </header>
      <hr className="border-black" />
      <div className="flex justify-center w-[1000px] mx-auto my-[40px] gap-[40px] grow">
        <section id="action-section" className="">
          <div className="sticky w-[400px] top-[50%] right-[50%] -translate-y-1/2">
            <div className="h-fit border-[1px] space-y-4 p-4 border-black flex flex-col">
              <header className="flex text-center space-x-4">
                <UserButton afterSignOutUrl="/" />
                <p>
                  Signed in as{" "}
                  <span className="font-bold">{self?.username}</span>
                </p>
              </header>
              <hr className="border-black" />
              <div className="flex space-x-4 basis-full grow">
                <div className="h-full basis-0.5 grow rounded-none flex flex-col justify-between text-center">
                  {/* <h2>Create New Lobby</h2> */}
                  <Button onClick={handleCreate}>Create</Button>
                </div>
                <div className="h-full basis-0.5 grow rounded-none flex flex-col justify-between text-center">
                  {/* <h2>Join a Lobby</h2> */}
                  <Button onClick={handleJoin}>Join</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ScrollArea className="h-[650px] pr-4">
          <section id="about-section" className="space-y-4">
            <p>
              Welcome to DoodleConnect, a party chat app with live video and
              audio and a shared canvas where drawings from your friends are
              displayed in realtime. Use the buttons to create a new lobby or
              enter the link provided to you for an existing lobby.
            </p>
            <p>
              DoodleConnect is a small tech demo that combines many technologies
              I recently learned, each of which has a description below and a
              link to the official documentation or about page.
            </p>
            <div className="flex items-center gap-4">
              <p>Connect with me:</p>
              <div className="flex space-x-2 items-center">
                <Link
                  href="https://www.linkedin.com/in/daniel-somorov-05705313b/"
                  className="bg-blue-600 border-2 border-blue-600 hover:border-white text-white rounded-full aspect-square w-[40px] flex justify-center items-center"
                >
                  <Linkedin width={20} />
                </Link>
                <Link
                  href="https://github.com/Somorovd"
                  className="bg-black border-2 border-black hover:border-white text-white rounded-full aspect-square w-[40px] flex justify-center items-center"
                >
                  <Github width={20} />
                </Link>
                <Link
                  href="https://somorovd.github.io/"
                  className="bg-yellow-500 border-2 border-yellow-500 hover:border-white text-white rounded-full aspect-square w-[40px] flex justify-center items-center"
                >
                  <CircleUserRound width={20} />
                </Link>
              </div>
              <p>Source Code:</p>
              <div className="flex space-x-2">
                <Link
                  href="https://github.com/Somorovd/DoodleConnect"
                  className="bg-emerald-500 border-2 border-emerald-500 hover:border-white text-white rounded-full aspect-square w-[40px] flex justify-center items-center"
                >
                  <CodeSquare width={20} />
                </Link>
              </div>
            </div>
            <hr className="border-black" />
            <div>
              <Accordion type="single" collapsible>
                <TechAccordionIcon tech="NextJS" link="https://nextjs.org/docs">
                  <p>
                    Next.js is a React framework for developing modern full
                    stack web applications. Features include file-based routing,
                    client- and server-side rendering, and data fetching with
                    caching and revalidation.
                  </p>
                </TechAccordionIcon>
                <TechAccordionIcon
                  tech="TypeScript"
                  link="https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html"
                >
                  <p>
                    TypeScript is a statically typed superset of JavaScript that
                    enhances the development experience by introducing strong
                    typing, enabling developers to catch errors early in the
                    development process.It provides improved code
                    maintainability, better tooling support, and facilitates the
                    creation of scalable and robust applications. TypeScript
                    compiles to plain JavaScript, making it compatible with
                    existing JavaScript codebases, while its additional features
                    such as interfaces and advanced type checking contribute to
                    more reliable and efficient code.
                  </p>
                </TechAccordionIcon>
                <TechAccordionIcon
                  tech="MongoDB"
                  link="https://www.mongodb.com/"
                >
                  <p>
                    MongoDB is a widely-used NoSQL database for efficiently
                    storing and managing large volumes of diverse data types
                    utilizing a flexible and scalable JSON-like
                    document-oriented structure.
                  </p>
                </TechAccordionIcon>
                <TechAccordionIcon
                  tech="Mongoose"
                  link="https://mongoosejs.com/docs/"
                >
                  <p>
                    Mongoose is a MongoDB object modeling tool designed for
                    Node.js applications. It provides a schema-based solution
                    for interacting with MongoDB databases, making it easier to
                    manage data relationships, perform validations, and
                    streamline queries.
                  </p>
                </TechAccordionIcon>
                <TechAccordionIcon
                  tech="Tailwind CSS"
                  link="https://tailwindcss.com/docs/installation"
                >
                  <p>
                    Tailwind CSS is a utility-first CSS framework that
                    streamlines the process of designing and styling websites.
                    It provides a set of pre-built, low-level utility classes
                    that can be easily applied directly in the HTML markup,
                    allowing for rapid and efficient development. With a focus
                    on simplicity and flexibility, Tailwind eliminates the need
                    for writing custom CSS, making it a practical choice for
                    developers aiming to build responsive and modern user
                    interfaces.
                  </p>
                </TechAccordionIcon>
                <TechAccordionIcon
                  tech="Zustand"
                  link="https://github.com/pmndrs/zustand"
                >
                  <p>
                    Zustand is a lightweight state management library for React
                    applications. It offers a simple API for managing global and
                    local state. With its minimalistic design and efficient
                    updates, Zustand provides developers with an easy-to-use
                    solution for state management in their projects.
                  </p>
                </TechAccordionIcon>
                <TechAccordionIcon
                  tech="Clerk"
                  link="https://clerk.com/docs/quickstarts/nextjs"
                >
                  <p>
                    Clerk is a comprehensive user management platform with
                    flexible API and embedabble UI to handle user authentication
                    and security.
                  </p>
                </TechAccordionIcon>
                <TechAccordionIcon
                  tech="PartyKit"
                  link="https://docs.partykit.io/quickstart/"
                >
                  <p>
                    Partykit is a websockets library that facilitates real-time
                    communication between a web server and clients and
                    simplifies the development of multiplayer applications.
                  </p>
                </TechAccordionIcon>
                <TechAccordionIcon
                  tech="LiveKit"
                  link="https://docs.livekit.io/realtime/quickstarts/nextjs-13/"
                >
                  <p>
                    LiveKit is the open source stack for streaming audio, video,
                    and data. LiveKit works across many platforms, and has
                    prebuilt components and hooks for use with React and NextJS.
                  </p>
                </TechAccordionIcon>
                <TechAccordionIcon
                  tech="Shadcn/ui"
                  link="https://ui.shadcn.com/"
                >
                  <p>
                    Shadcn/UI is a lightweight and user-friendly UI framework
                    that simplifies the development of interactive and
                    responsive web applications. It offers a range of
                    pre-designed components and styling options, streamlining
                    the creation of modern and visually appealing user
                    interfaces.
                  </p>
                </TechAccordionIcon>
              </Accordion>
            </div>
          </section>
        </ScrollArea>
      </div>
    </div>
  );
}
