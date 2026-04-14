import { useState } from "react";
import { Button, Drawer, useOverlayState } from "@heroui/react";
import SolarHamburgerMenuLineDuotone from "~icons/solar/hamburger-menu-line-duotone";

const links = [
  { label: "Why", href: "#why" },
  { label: "Guides", href: "#guides" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Install", href: "#install" },
  {
    label: "GitHub",
    href: "https://github.com/powxenv/okx-trade-skills",
    external: true,
  },
];

function MobileDrawer() {
  const state = useOverlayState();

  return (
    <Drawer state={state}>
      <Button isIconOnly variant="ghost" className="md:hidden" onPress={state.open}>
        <SolarHamburgerMenuLineDuotone className="size-6 text-zinc-600" />
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Handle />
            <Drawer.Header>
              <Drawer.Heading className="text-zinc-600">Menu</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-4 pb-6 text-zinc-600">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-base hover:text-zinc-900 transition-colors py-1"
                    onClick={() => state.close()}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 py-4 md:py-6 bg-white/80 backdrop-blur-lg z-50">
      <div className="inner flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-medium -tracking-wider">
          <img src="/okx.svg" alt="OKX" className="h-5" />
          Trade Skills
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-zinc-900 transition-colors"
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <MobileDrawer />
      </div>
    </header>
  );
}
