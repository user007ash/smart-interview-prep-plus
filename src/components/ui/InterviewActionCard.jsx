
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

/**
 * Reusable card component for interview actions
 * @param {Object} props - Component properties
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.buttonText - Text for the action button
 * @param {string} props.buttonLink - Link destination for the button
 * @param {React.ReactNode} props.children - Additional content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onButtonClick - Button click handler (alternative to buttonLink)
 * @param {string} props.buttonVariant - Button variant (default, outline, etc.)
 * @param {boolean} props.disabled - Whether the button is disabled
 */
const InterviewActionCard = ({
  title,
  description,
  icon,
  buttonText,
  buttonLink,
  children,
  className = '',
  onButtonClick,
  buttonVariant = 'default',
  disabled = false
}) => {
  // Determine button content based on props
  const renderButton = () => {
    const buttonClass = buttonVariant === 'default' 
      ? 'bg-interview-purple hover:bg-interview-darkPurple' 
      : buttonVariant === 'outline'
        ? 'border-interview-purple text-interview-purple hover:bg-interview-softBg'
        : '';
    
    if (onButtonClick) {
      return (
        <Button 
          className={buttonClass}
          onClick={onButtonClick} 
          variant={buttonVariant}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      );
    } else if (buttonLink) {
      return (
        <Button 
          className={buttonClass}
          variant={buttonVariant}
          disabled={disabled}
          asChild
        >
          <Link to={buttonLink}>{buttonText}</Link>
        </Button>
      );
    }
    
    return null;
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        {icon && <div className="mb-3">{icon}</div>}
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
      
      {(buttonText || buttonLink) && (
        <CardFooter>
          {renderButton()}
        </CardFooter>
      )}
    </Card>
  );
};

export default InterviewActionCard;
