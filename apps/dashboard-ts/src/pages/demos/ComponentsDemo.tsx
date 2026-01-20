import React, { useState } from "react";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Modal } from "../../ui/Modal";

export default function ComponentsDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h2 className="page-title">Component Library Demo</h2>
      <p className="page-subtitle">
        A small UI kit: typed props, consistent styling, accessible focus, and predictable composition.
      </p>

      <div className="grid grid--cards">
        <Card title="Buttons" description="Primary, secondary, ghost. Disabled + focus states.">
          <div className="demo-row">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>

        <Card title="Cards" description="Reusable surfaces for content and layout.">
          <div className="demo-stack">
            <div className="demo-note">Cards are composable: header + body sections.</div>
            <Card className="ui-card--sub" title="Nested card" description="Useful for grouped content.">
              <div className="demo-note">No extra layout glue required.</div>
            </Card>
          </div>
        </Card>

        <Card title="Modal" description="ESC closes. Click outside closes. Focus moves in and returns.">
          <div className="demo-row">
            <Button onClick={() => setOpen(true)}>Open modal</Button>
          </div>

          <Modal open={open} title="Example Modal" onClose={() => setOpen(false)}>
            <p style={{ marginTop: 0, color: "rgba(255,255,255,.70)", lineHeight: 1.6 }}>
              This modal demonstrates basic accessibility behavior:
              focus enters on open, ESC closes, and focus returns to the opener on close.
            </p>
            <div className="demo-row">
              <Button onClick={() => alert("Action!")}>Primary action</Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </Modal>
        </Card>
      </div>
    </div>
  );
}
