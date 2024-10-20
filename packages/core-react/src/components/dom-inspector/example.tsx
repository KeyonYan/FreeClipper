import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InspectorDialogContent() {
	return (
		<>
			<DialogHeader>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="name" className="text-right">
						Name
					</Label>
					<Input id="name" value="Pedro Duarte" className="col-span-3" />
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="username" className="text-right">
						Username
					</Label>
					<Input id="username" value="@peduarte" className="col-span-3" />
				</div>
			</div>
			<DialogFooter>
				<Button type="submit">Save changes</Button>
			</DialogFooter>
		</>
	);
}

export function InspectorTargetExample() {
	return (
		<article>
			<h1>Article Title</h1>
			<p>
				This is a paragraph with a <a href="https://example.com">link</a> and <strong>bold</strong> text.
			</p>
			<div>
				This is a div with <span>span</span> and <code>code</code> elements.
			</div>
			<pre>This is a preformatted block of text.</pre>
			<img src="https://dummyimage.com/300" alt="An example" />
			<h3>Subheading</h3>
			<h1>Article Title</h1>
			<p>
				This is a paragraph with a <a href="https://example.com">link</a> and <strong>bold</strong> text.
			</p>
			<div>
				This is a div with <span>span</span> and <code>code</code> elements.
			</div>
			<pre>This is a preformatted block of text.</pre>
			<img src="https://dummyimage.com/300" alt="An example" />
			<h3>Subheading</h3>
			<h1>Article Title</h1>
			<p>
				This is a paragraph with a <a href="https://example.com">link</a> and <strong>bold</strong> text.
			</p>
			<div>
				This is a div with <span>span</span> and <code>code</code> elements.
			</div>
			<pre>This is a preformatted block of text.</pre>
			<img src="https://dummyimage.com/300" alt="An example" />
			<h3>Subheading</h3>
			<h1>Article Title</h1>
			<p>
				This is a paragraph with a <a href="https://example.com">link</a> and <strong>bold</strong> text.
			</p>
			<div>
				This is a div with <span>span</span> and <code>code</code> elements.
			</div>
			<pre>This is a preformatted block of text.</pre>
			<img src="https://dummyimage.com/300" alt="An example" />
			<h3>Subheading</h3>
			<h1>Article Title</h1>
			<p>
				This is a paragraph with a <a href="https://example.com">link</a> and <strong>bold</strong> text.
			</p>
			<div>
				This is a div with <span>span</span> and <code>code</code> elements.
			</div>
			<pre>This is a preformatted block of text.</pre>
			<img src="https://dummyimage.com/300" alt="An example" />
			<h3>Subheading</h3>
		</article>
	);
}
