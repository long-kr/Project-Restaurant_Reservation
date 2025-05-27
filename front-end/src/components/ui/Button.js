import clsx from 'clsx';

export function Button({
	children,
	className,
    ...rest
}) {
	return (
		<button className={clsx("btn",  className)} {...rest}>
			{children}
		</button>
	);
}
