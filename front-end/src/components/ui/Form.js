import clsx from "clsx";
import React from "react";

/**
 * Reusable Form component with built-in validation and error handling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form content
 * @param {Function} props.onSubmit - Form submit handler
 * @param {boolean} props.isLoading - Whether form is in loading state
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.validation - Form-level validation object
 * @param {Object} props.rest - Additional props passed to form element
 */
export function Form({
	children,
	onSubmit,
	isLoading = false,
	className,
	validation,
	...rest
}) {
	const handleSubmit = (e) => {
		e.preventDefault();

		if (isLoading) {
			return;
		}

		onSubmit(e);
	};

	const formClasses = clsx(
		"needs-validation",
		{
			"was-validated": validation && Object.keys(validation).length > 0,
		},
		className
	);

	return (
		<form onSubmit={handleSubmit} className={formClasses} noValidate {...rest}>
			{children}
		</form>
	);
}

/**
 * Form Field Group component for organizing related form fields
 */
export function FormFieldGroup({ children, className, ...rest }) {
	return (
		<div className={clsx("form-row", className)} {...rest}>
			{children}
		</div>
	);
}

/**
 * Form Actions component for submit/cancel buttons
 */
export function FormActions({ children, className, align = "start", ...rest }) {
	const alignClasses = {
		start: "justify-content-start",
		center: "justify-content-center",
		end: "justify-content-end",
		between: "justify-content-between",
	};

	return (
		<div
			className={clsx(
				"d-flex gap-2 mt-4",
				alignClasses[align] || alignClasses.start,
				className
			)}
			{...rest}
		>
			{children}
		</div>
	);
}
