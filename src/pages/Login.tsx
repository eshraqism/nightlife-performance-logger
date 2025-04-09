
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createUser } from '@/utils/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Container from '@/components/layout/Container';
import { CalendarDays } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin) {
        // Register
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords don't match",
            variant: "destructive"
          });
          return;
        }
        
        createUser(username, password);
        toast({
          title: "Success",
          description: "Account created! Please login.",
        });
        setIsLogin(true);
      } else {
        // Login
        const success = await login(username, password);
        
        if (success) {
          toast({
            title: "Success",
            description: "Login successful!",
          });
          navigate('/');
        } else {
          toast({
            title: "Error",
            description: "Invalid username or password",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="pt-12 max-w-md">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-8 w-8" />
            <span className="font-medium text-2xl">Nightlife Tracker</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? 'Login to Your Account' : 'Create an Account'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
              type="button"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
