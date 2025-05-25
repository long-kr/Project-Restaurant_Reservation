import clsx from 'clsx';

/**
 * 
 * @param {object} props
 * @param {string} [props.type="button"] - The type of the button.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {React.ReactNode} props.children - The content of the button.
 * @returns 
 */

export function Button({
	children,
	type = "button",
	className,
    ...props
}) {
	return (
		<button className={clsx("btn",  className)} {...props}>
			{children}
		</button>
	);
}
