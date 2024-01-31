"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModalType, useModal } from "@/hooks/use-modal";
import { UserButton, redirectToSignIn, useUser } from "@clerk/nextjs";
import { Accordion } from "@/components/ui/accordion";
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
    <>
      <header className="mb-4">
        <h1 className="text-[4rem] text-center">DoodleConnect</h1>
        <h2 className="text-[2rem] text-center">
          Chat with friends while making silly art
        </h2>
      </header>
      <hr className="border-black" />
      <div className="flex justify-center w-[1000px] mx-auto my-[40px] gap-[40px]">
        {/* <ScrollArea className="h-[400px] pr-4"> */}

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
        <section id="about-section" className="space-y-4">
          <p>
            Welcome to DoodleConnect! This project is a small tech demo for a
            number of technologies I was recently exploring, each of which has a
            link and description below.
          </p>
          <p>
            DoodleConnect is a party chat app with live video and audio feed.
            Each lobby also has a shared canvas where drawings from your friends
            are displayed in realtime. Use the buttons to create a new lobby or
            enter the link provided to you for an existing lobby.
          </p>
          <div>
            <div className="flex space-x-2">
              <p>Connect with me:</p>
              <Link href="https://www.linkedin.com/in/daniel-somorov-05705313b/">
                LinkedIn
              </Link>
              <Link href="https://github.com/Somorovd">GitHub</Link>
              <Link href="https://somorovd.github.io/">Portfolio</Link>
            </div>
            <div className="flex space-x-2">
              <p>Source Code:</p>
              <Link href="https://github.com/Somorovd/DoodleConnect">
                GitHub
              </Link>
            </div>
          </div>
          <hr className="border-black" />
          <div>
            <Accordion type="single" collapsible>
              <TechAccordionIcon tech="NextJS">
                <p>NextJS</p>
              </TechAccordionIcon>
              <TechAccordionIcon tech="TypeScript">
                <p>TypeScript</p>
              </TechAccordionIcon>
              <TechAccordionIcon tech="MongoDB">
                <p>MongoDB</p>
              </TechAccordionIcon>
              <TechAccordionIcon tech="Mongoose">
                <p>Mongoose</p>
              </TechAccordionIcon>
              <TechAccordionIcon tech="Tailwind">
                <p>Tailwind</p>
              </TechAccordionIcon>
              <TechAccordionIcon tech="Zustand">
                <p>Zustand</p>
              </TechAccordionIcon>
              <TechAccordionIcon tech="Clerk">
                <p>Clerk</p>
              </TechAccordionIcon>
              <TechAccordionIcon tech="PartyKit">
                <p>PartyKit</p>
              </TechAccordionIcon>
              <TechAccordionIcon tech="LiveKit">
                <p>LiveKit</p>
              </TechAccordionIcon>
              <TechAccordionIcon tech="Shadcn/ui">
                <p>Shadcn/ui</p>
              </TechAccordionIcon>
            </Accordion>
          </div>
        </section>
        {/* </ScrollArea> */}
      </div>
    </>
  );
}
