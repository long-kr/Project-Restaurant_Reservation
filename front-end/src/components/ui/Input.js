import clsx from "clsx";
import React from "react";

/**
 * Reusable Input component with validation support
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, tel, number, date, time, etc.)
 * @param {string} props.name - Input name attribute
 * @param {string} props.id - Input id attribute
 * @param {string} props.label - Label text for the input
 * @param {string} props.placeholder - Placeholder text
 * @param {string|number} props.value - Input value
 * @param {Function} props.onChange - Change handler function
 * @param {Function} props.onBlur - Blur handler function
 * @param {boolean} props.required - Whether input is required
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.readOnly - Whether input is read-only
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.error - Error message to display
 * @param {string} props.helpText - Help text to display below input
 * @param {string} props.size - Input size (sm, lg)
 * @param {Object} props.validation - Validation object with isValid and message
 * @param {Object} props.rest - Additional props passed to input element
 */
export function Input({
	type = "text",
	name,
	id,
	label,
	placeholder,
	value,
	onChange,
	onBlur,
	required = false,
	disabled = false,
	readOnly = false,
	className,
	error,
	helpText,
	size,
	validation,
	...rest
}) {
	// Use validation prop if provided, otherwise use error prop
	const hasError = error || (validation && !validation.isValid);
	const errorMessage = error || (validation && validation.message);

	const inputClasses = clsx(
		"form-control",
		{
			"is-invalid": hasError,
			"is-valid": validation && validation.isValid && value,
			"form-control-sm": size === "sm",
			"form-control-lg": size === "lg",
		},
		className
	);

	const inputId = id || name;

	return (
		<div className='mb-3'>
			{label && (
				<label htmlFor={inputId} className='form-label'>
					<p>
						{label}: {required && <span className='text-danger ms-1'>*</span>}
					</p>
				</label>
			)}

			<input
				type={type}
				id={inputId}
				name={name}
				className={inputClasses}
				placeholder={placeholder}
				value={value || ""}
				onChange={onChange}
				onBlur={onBlur}
				required={required}
				disabled={disabled}
				readOnly={readOnly}
				aria-describedby={
					errorMessage
						? `${inputId}-error`
						: helpText
						? `${inputId}-help`
						: undefined
				}
				aria-invalid={hasError ? "true" : "false"}
				{...rest}
			/>

			{errorMessage && (
				<div id={`${inputId}-error`} className='small' role='alert'>
					<p>- {errorMessage}</p>
				</div>
			)}

			{helpText && !errorMessage && (
				<div id={`${inputId}-help`} className='small'>
					<p>{helpText}</p>
				</div>
			)}
		</div>
	);
}
