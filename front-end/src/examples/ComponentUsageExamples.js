import React from "react";
import {
	Button,
	Form,
	FormActions,
	FormFieldGroup,
	Input,
} from "../components/ui";
import { useFormValidation, validationRules } from "../hooks/useFormValidation";

/**
 * Example component demonstrating how to use the new reusable components
 * This file serves as documentation and examples for developers
 */

// Example 1: Basic Input Usage
export function BasicInputExample() {
	const [value, setValue] = React.useState("");

	return (
		<div className='mb-4'>
			<h5>Basic Input Example</h5>
			<Input
				type='text'
				name='example'
				label='Example Input'
				placeholder='Enter some text'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				helpText='This is help text'
			/>
		</div>
	);
}

// Example 2: Input with Validation
export function ValidatedInputExample() {
	const [value, setValue] = React.useState("");
	const [error, setError] = React.useState("");

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return "Please enter a valid email address";
		}
		return null;
	};

	const handleBlur = () => {
		const validationError = validateEmail(value);
		setError(validationError);
	};

	return (
		<div className='mb-4'>
			<h5>Validated Input Example</h5>
			<Input
				type='email'
				name='email'
				label='Email Address'
				placeholder='Enter your email'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onBlur={handleBlur}
				error={error}
				required
			/>
		</div>
	);
}

// Example 3: Button Variants
export function ButtonVariantsExample() {
	return (
		<div className='mb-4'>
			<h5>Button Variants Example</h5>
			<div className='d-flex gap-2 flex-wrap'>
				<Button variant='primary'>Primary</Button>
				<Button variant='secondary'>Secondary</Button>
				<Button variant='success'>Success</Button>
				<Button variant='danger'>Danger</Button>
				<Button variant='warning'>Warning</Button>
				<Button variant='info'>Info</Button>
				<Button variant='light'>Light</Button>
				<Button variant='dark'>Dark</Button>
				<Button variant='outline-primary'>Outline Primary</Button>
				<Button variant='outline-secondary'>Outline Secondary</Button>
			</div>

			<h6 className='mt-3'>Button Sizes</h6>
			<div className='d-flex gap-2 align-items-center'>
				<Button variant='primary' size='sm'>
					Small
				</Button>
				<Button variant='primary'>Normal</Button>
				<Button variant='primary' size='lg'>
					Large
				</Button>
			</div>

			<h6 className='mt-3'>Loading State</h6>
			<Button variant='primary' loading>
				Loading Button
			</Button>
		</div>
	);
}

// Example 4: Form with Validation Hook
export function FormValidationExample() {
	const initialValues = {
		name: "",
		email: "",
		age: "",
	};

	const formValidationRules = {
		name: [
			validationRules.required("Name is required"),
			validationRules.minLength(2, "Name must be at least 2 characters"),
		],
		email: [
			validationRules.required("Email is required"),
			validationRules.email("Please enter a valid email"),
		],
		age: [
			validationRules.required("Age is required"),
			validationRules.min(18, "Must be at least 18 years old"),
			validationRules.max(120, "Age seems unrealistic"),
		],
	};

	const onSubmit = (values) => {
		console.log("Form submitted with values:", values);
		alert(
			`Form submitted successfully!\n\nName: ${values.name}\nEmail: ${values.email}\nAge: ${values.age}`
		);
	};

	const { getFieldProps, handleSubmit, isValid, resetForm } = useFormValidation(
		initialValues,
		formValidationRules,
		onSubmit
	);

	return (
		<div className='mb-4'>
			<h5>Form with Validation Hook Example</h5>
			<div className='card'>
				<div className='card-body'>
					<Form onSubmit={handleSubmit}>
						<FormFieldGroup className='row'>
							<div className='col-md-6'>
								<Input
									type='text'
									label='Full Name'
									placeholder='Enter your full name'
									{...getFieldProps("name")}
								/>
							</div>
							<div className='col-md-6'>
								<Input
									type='email'
									label='Email Address'
									placeholder='Enter your email'
									{...getFieldProps("email")}
								/>
							</div>
						</FormFieldGroup>

						<Input
							type='number'
							name='age'
							label='Age'
							placeholder='Enter your age'
							min='18'
							max='120'
							{...getFieldProps("age")}
						/>

						<FormActions align='between'>
							<Button
								variant='outline-secondary'
								onClick={resetForm}
								type='button'
							>
								Reset
							</Button>
							<Button variant='primary' type='submit' disabled={!isValid}>
								Submit
							</Button>
						</FormActions>
					</Form>
				</div>
			</div>
		</div>
	);
}

// Example 5: Complete Form Example
export function CompleteFormExample() {
	const [formData, setFormData] = React.useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		message: "",
	});

	const [errors, setErrors] = React.useState({});

	const validateForm = () => {
		const newErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "First name is required";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Last name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!formData.phone.trim()) {
			newErrors.phone = "Phone number is required";
		} else if (
			!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)
		) {
			newErrors.phone = "Please enter a valid phone number";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			console.log("Form submitted:", formData);
			alert("Form submitted successfully!");
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: null,
			}));
		}
	};

	return (
		<div className='mb-4'>
			<h5>Complete Form Example</h5>
			<div className='card'>
				<div className='card-header'>
					<h6 className='mb-0'>Contact Form</h6>
				</div>
				<div className='card-body'>
					<Form onSubmit={handleSubmit}>
						<FormFieldGroup className='row'>
							<div className='col-md-6'>
								<Input
									type='text'
									name='firstName'
									label='First Name'
									placeholder='Enter your first name'
									value={formData.firstName}
									onChange={handleChange}
									error={errors.firstName}
									required
								/>
							</div>
							<div className='col-md-6'>
								<Input
									type='text'
									name='lastName'
									label='Last Name'
									placeholder='Enter your last name'
									value={formData.lastName}
									onChange={handleChange}
									error={errors.lastName}
									required
								/>
							</div>
						</FormFieldGroup>

						<FormFieldGroup className='row'>
							<div className='col-md-6'>
								<Input
									type='email'
									name='email'
									label='Email Address'
									placeholder='Enter your email'
									value={formData.email}
									onChange={handleChange}
									error={errors.email}
									required
								/>
							</div>
							<div className='col-md-6'>
								<Input
									type='tel'
									name='phone'
									label='Phone Number'
									placeholder='xxx-xxx-xxxx'
									value={formData.phone}
									onChange={handleChange}
									error={errors.phone}
									required
								/>
							</div>
						</FormFieldGroup>

						<Input
							type='textarea'
							name='message'
							label='Message'
							placeholder='Enter your message'
							value={formData.message}
							onChange={handleChange}
							rows='4'
						/>

						<FormActions align='center'>
							<Button variant='primary' type='submit'>
								Send Message
							</Button>
						</FormActions>
					</Form>
				</div>
			</div>
		</div>
	);
}

// Main component that renders all examples
export default function ComponentUsageExamples() {
	return (
		<div className='container mt-4'>
			<div className='row'>
				<div className='col-12'>
					<h2>Reusable Components Usage Examples</h2>
					<p className='text-muted'>
						This page demonstrates how to use the new reusable components and
						form validation hooks.
					</p>

					<BasicInputExample />
					<ValidatedInputExample />
					<ButtonVariantsExample />
					<FormValidationExample />
					<CompleteFormExample />
				</div>
			</div>
		</div>
	);
}
