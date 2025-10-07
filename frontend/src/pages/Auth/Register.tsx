import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, AlertTriangle, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { useCompliance } from '@/providers/ComplianceProvider';
import { useAccessibility } from '@/providers/AccessibilityProvider';
import { authService } from '@/services/authService';
import AuthLayout from '@/components/Auth/AuthLayout';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { logAccess } = useCompliance();
  const { announceToScreenReader } = useAccessibility();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age)) {
      newErrors.age = 'Age is required';
    } else if (age < 13 || age > 23) {
      newErrors.age = 'This platform is designed for youth aged 13-23';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }

    if (!agreedToPrivacy) {
      newErrors.privacy = 'You must agree to the Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      announceToScreenReader('Please correct the errors in the form');
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      setErrors({ general: 'Please agree to the Terms of Service and Privacy Policy.' });
      announceToScreenReader('Please agree to the terms and privacy policy');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      logAccess('REGISTRATION_ATTEMPT', 'AUTHENTICATION');

      // Use auth service for registration
      const data = await authService.register({
        email: formData.email.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        username: formData.email.trim(), // Use email as username
        age: parseInt(formData.age),
        role: formData.role,
      });

      logAccess('REGISTRATION_SUCCESS', 'AUTHENTICATION', {
        email: formData.email,
        role: formData.role
      });
      announceToScreenReader('Registration successful. Please proceed to role selection.');

      // Store temporary user data for role selection
      localStorage.setItem('pending_user', JSON.stringify({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      }));

      navigate('/role-selection');
    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle specific registration errors
      if (error.data) {
        const apiErrors: Record<string, string> = {};

        if (error.data.email) {
          apiErrors.email = Array.isArray(error.data.email) ? error.data.email[0] : error.data.email;
        }
        if (error.data.username) {
          apiErrors.email = 'An account with this email already exists.';
        }
        if (error.data.password) {
          apiErrors.password = Array.isArray(error.data.password) ? error.data.password[0] : error.data.password;
        }

        if (Object.keys(apiErrors).length > 0) {
          setErrors(apiErrors);
        } else {
          setErrors({ general: error.data.detail || 'Registration failed. Please try again.' });
        }
      } else {
        setErrors({ general: error.message || 'Network error. Please check your connection and try again.' });
      }

      logAccess('REGISTRATION_ERROR', 'AUTHENTICATION', { error: error.message });
      announceToScreenReader('Registration failed. Please check the error messages.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AuthLayout 
      title="Join EduMindSolutions" 
      subtitle="Create your account to access mental health support"
      isLogin={false}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {errors.general}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="First name"
                  required
                  autoComplete="given-name"
                  className="h-12 px-4 border-gray-200 focus:border-healthcare-primary focus:ring-healthcare-primary transition-all duration-200"
                />
                {errors.firstName && (
                  <motion.p 
                    className="text-sm text-red-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Last name"
                  required
                  autoComplete="family-name"
                  className="h-12 px-4 border-gray-200 focus:border-healthcare-primary focus:ring-healthcare-primary transition-all duration-200"
                />
                {errors.lastName && (
                  <motion.p 
                    className="text-sm text-red-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.lastName}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="h-12 px-4 border-gray-200 focus:border-healthcare-primary focus:ring-healthcare-primary transition-all duration-200"
              />
              {errors.email && (
                <motion.p 
                  className="text-sm text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
              <Select value={formData.age} onValueChange={(value) => handleInputChange('age', value)}>
                <SelectTrigger className="h-12 border-gray-200 focus:border-healthcare-primary focus:ring-healthcare-primary transition-all duration-200">
                  <SelectValue placeholder="Select your age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 11 }, (_, i) => i + 13).map(age => (
                    <SelectItem key={age} value={age.toString()}>
                      {age} years old
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.age && (
                <motion.p 
                  className="text-sm text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.age}
                </motion.p>
              )}
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                  className="h-12 px-4 pr-12 border-gray-200 focus:border-healthcare-primary focus:ring-healthcare-primary transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <motion.p 
                  className="text-sm text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  className="h-12 px-4 pr-12 border-gray-200 focus:border-healthcare-primary focus:ring-healthcare-primary transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <motion.p 
                  className="text-sm text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1 border-gray-300"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms-of-service" className="text-healthcare-primary hover:text-blue-700 font-medium transition-colors duration-200">
                      Terms of Service
                    </Link>
                  </Label>
                </div>
                {errors.terms && (
                  <motion.p 
                    className="text-sm text-red-600 ml-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.terms}
                  </motion.p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={agreedToPrivacy}
                    onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                    className="mt-1 border-gray-300"
                  />
                  <Label htmlFor="privacy" className="text-sm leading-relaxed text-gray-700">
                    I agree to the{' '}
                    <Link to="/privacy-policy" className="text-healthcare-primary hover:text-blue-700 font-medium transition-colors duration-200">
                      Privacy Policy
                    </Link>{' '}
                    and understand how my data will be protected
                  </Label>
                </div>
                {errors.privacy && (
                  <motion.p 
                    className="text-sm text-red-600 ml-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.privacy}
                  </motion.p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-healthcare-primary to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-8 text-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full h-12 px-6 text-healthcare-primary border-2 border-healthcare-primary rounded-lg font-semibold hover:bg-healthcare-primary hover:text-white transition-all duration-200 transform hover:scale-[1.02]"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Register;
