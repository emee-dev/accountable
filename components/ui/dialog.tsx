// "use client";

// import * as React from "react";
// import * as DialogPrimitive from "@radix-ui/react-dialog";
// import { XIcon } from "lucide-react";

// import { cn } from "@/lib/utils";

// function Dialog({
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Root>) {
//   return <DialogPrimitive.Root data-slot="dialog" {...props} />;
// }

// function DialogTrigger({
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
//   return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
// }

// function DialogPortal({
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
//   return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
// }

// function DialogClose({
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Close>) {
//   return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
// }

// interface ExtendedDialogOverlayProps
//   extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
//   showOverlay?: boolean;
// }

// function DialogOverlay({
//   className,
//   showOverlay = true,
//   ...props
// }: ExtendedDialogOverlayProps) {
//   return (
//     <DialogPrimitive.Overlay
//       data-slot="dialog-overlay"
//       className={cn(
//         "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
//         // Overlay props
//         "bg-muted-foreground/20 transition-opacity backdrop-blur-[2px]",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// interface ExtendedDialogContentProps
//   extends React.ComponentProps<typeof DialogPrimitive.Content> {
//   showOverlay?: boolean;
//   showCloseButton?: boolean;
// }

// function DialogContent({
//   className,
//   children,
//   showOverlay,
//   showCloseButton = true,
//   ...props
// }: ExtendedDialogContentProps) {
//   return (
//     <DialogPortal data-slot="dialog-portal">
//       <DialogOverlay showOverlay={showOverlay} />
//       <DialogPrimitive.Content
//         data-slot="dialog-content"
//         className={cn(
//           "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
//           className
//         )}
//         {...props}
//       >
//         {children}
//         {showCloseButton && (
//           <DialogPrimitive.Close
//             data-slot="dialog-close"
//             className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
//           >
//             <XIcon />
//             <span className="sr-only">Close</span>
//           </DialogPrimitive.Close>
//         )}
//       </DialogPrimitive.Content>
//     </DialogPortal>
//   );
// }

// function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="dialog-header"
//       className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
//       {...props}
//     />
//   );
// }

// function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="dialog-footer"
//       className={cn(
//         "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function DialogTitle({
//   className,
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Title>) {
//   return (
//     <DialogPrimitive.Title
//       data-slot="dialog-title"
//       className={cn("text-lg leading-none font-semibold", className)}
//       {...props}
//     />
//   );
// }

// function DialogDescription({
//   className,
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Description>) {
//   return (
//     <DialogPrimitive.Description
//       data-slot="dialog-description"
//       className={cn("text-muted-foreground text-sm", className)}
//       {...props}
//     />
//   );
// }

// export {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogOverlay,
//   DialogPortal,
//   DialogTitle,
//   DialogTrigger,
// };

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

type DialogOverlayProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Overlay
> & {
  showOverlay?: boolean;
};

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, showOverlay = true, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      {
        // TODO handle dark themes
        // "bg-white/90 dark:bg-black/40": showOverlay,
        "bg-muted-foreground/20 transition-opacity backdrop-blur-[2px]":
          showOverlay,
      },
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface ExtendedDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showOverlay?: boolean;
  showCloseButton?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ExtendedDialogContentProps
>(({ className, children, showOverlay, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay showOverlay={showOverlay} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      {/* <DialogPrimitive.Close
        className="absolute right-1 top-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        asChild
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-7 hover:bg-muted-foreground/50"
        >
          <X className="h-4" />
          <span className="sr-only">Close</span>
        </Button>
      </DialogPrimitive.Close> */}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
