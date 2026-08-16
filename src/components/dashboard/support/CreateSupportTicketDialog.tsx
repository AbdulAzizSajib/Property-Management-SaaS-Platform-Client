"use client";

// src/components/dashboard/support/CreateSupportTicketDialog.tsx

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { useCreateSupportTicket } from "@/src/hooks/useSupportTickets";
import {
    SUPPORT_TICKET_CATEGORY_OPTIONS,
    SUPPORT_TICKET_PRIORITY_OPTIONS,
    type SupportTicketCategory,
    type SupportTicketPriority,
} from "@/src/types/supportTicket.types";
import { useEffect, useState } from "react";

interface CreateSupportTicketDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateSupportTicketDialog({
    open,
    onOpenChange,
}: CreateSupportTicketDialogProps) {
    const mutation = useCreateSupportTicket();

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState<SupportTicketCategory>("OTHER");
    const [priority, setPriority] = useState<SupportTicketPriority>("MEDIUM");

    useEffect(() => {
        if (!open) return;
        setSubject("");
        setMessage("");
        setCategory("OTHER");
        setPriority("MEDIUM");
    }, [open]);

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const payload = {
            subject: subject.trim(),
            message: message.trim(),
            category,
            priority,
        };

        mutation.mutate(payload, {
            onSuccess: () => onOpenChange(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        New support ticket
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        Tell us what&apos;s going on. We&apos;ll follow up
                        right here on the ticket.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Subject" htmlFor="st-subject" required>
                        <Input
                            id="st-subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Unable to download invoice PDF"
                            required
                            className={fieldClass}
                        />
                    </Field>

                    <Field
                        label="Message"
                        htmlFor="st-message"
                        required
                        hint="What happened, and what were you trying to do?"
                    >
                        <Textarea
                            id="st-message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="The download button on the invoice detail page does nothing…"
                            required
                            className={`${fieldClass} resize-none`}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category" htmlFor="st-category" required>
                            <Select
                                value={category}
                                onValueChange={(v) =>
                                    setCategory(
                                        (v ?? "OTHER") as SupportTicketCategory,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="st-category"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUPPORT_TICKET_CATEGORY_OPTIONS.map(
                                        (opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Priority" htmlFor="st-priority" required>
                            <Select
                                value={priority}
                                onValueChange={(v) =>
                                    setPriority(
                                        (v ?? "MEDIUM") as SupportTicketPriority,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="st-priority"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUPPORT_TICKET_PRIORITY_OPTIONS.map(
                                        (opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <FormActions
                        submitting={mutation.isPending}
                        submitLabel="Submit ticket"
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
