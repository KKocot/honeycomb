import Link from "next/link";
import { ReactNode } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export function LeavePageDialog({
  link,
  children,
}: {
  link: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="cursor-pointer text-destructive">{children}</span>
      </DialogTrigger>
      <DialogContent className="overflow-auto">
        <div className="text-2xl">You are about to leave this app.</div>
        <Separator />
        <div className="flex flex-col gap-4">
          <p>
            The link you&apos;ve clicked on will lead you to the following
            website:
          </p>
          <p className="break-all font-bold">{link}</p>
          <p>We are just verifying with you that you want to continue.</p>
          <Link
            target="_blank"
            rel="noopener noreferrer nofollow external"
            href={link}
            className="w-fit"
          >
            <Button>Open Link</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
