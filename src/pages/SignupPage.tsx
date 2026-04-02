import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../slices/authSlice";
import type { AppDispatch, RootState } from "../store";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Form,
  FormGroup,
  FormLabel,
  Input,
  FormError,
  Button,
} from "../components";
import { useToast } from "../contexts/ToastContext";

export const SignupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    const result = await dispatch(
      registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName || undefined,
        last_name: formData.lastName || undefined,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      showToast("Account created successfully!", "success");
      navigate("/");
    } else if (registerUser.rejected.match(result)) {
      const errorMsg =
        typeof result.payload === "string" ? result.payload : "Signup failed";
      showToast(errorMsg, "error");
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Airbnb Account</CardTitle>
          <CardDescription>
            Join us and start booking amazing places
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange("username")}
                disabled={loading}
                required
              />
              {validationErrors.username && (
                <FormError>{validationErrors.username}</FormError>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange("email")}
                disabled={loading}
                required
              />
              {validationErrors.email && (
                <FormError>{validationErrors.email}</FormError>
              )}
            </FormGroup>

            <div className="grid grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                  disabled={loading}
                />
              </FormGroup>
            </div>

            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange("password")}
                disabled={loading}
                required
              />
              {validationErrors.password && (
                <FormError>{validationErrors.password}</FormError>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                disabled={loading}
                required
              />
              {validationErrors.confirmPassword && (
                <FormError>{validationErrors.confirmPassword}</FormError>
              )}
            </FormGroup>

            {error && <FormError>{error}</FormError>}

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
