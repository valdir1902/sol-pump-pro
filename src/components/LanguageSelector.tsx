import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Check, Globe, ChevronDown } from 'lucide-react';
import { supportedLanguages } from '../i18n/config';
import { cn } from '../lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  showFlag?: boolean;
  showName?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'default',
  size = 'md',
  showFlag = true,
  showName = true,
  className
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const renderTrigger = () => {
    switch (variant) {
      case 'icon-only':
        return (
          <Button 
            variant="ghost" 
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            className={cn('relative', className)}
          >
            <Globe className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        );
      
      case 'minimal':
        return (
          <Button 
            variant="ghost" 
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            className={cn('flex items-center space-x-2', sizeClasses[size], className)}
          >
            {showFlag && <span className="text-lg">{currentLanguage.flag}</span>}
            {showName && <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>}
            <ChevronDown className="w-3 h-3" />
          </Button>
        );
      
      default:
        return (
          <Button 
            variant="outline" 
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            className={cn('flex items-center space-x-2', sizeClasses[size], className)}
          >
            {showFlag && <span className="text-lg">{currentLanguage.flag}</span>}
            {showName && (
              <span className="font-medium">
                {size === 'sm' ? currentLanguage.code.toUpperCase() : currentLanguage.name}
              </span>
            )}
            <ChevronDown className="w-3 h-3" />
          </Button>
        );
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {renderTrigger()}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 max-h-80 overflow-y-auto bg-card border border-border shadow-lg"
      >
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
            {t('settings.language')}
          </div>
          
          {supportedLanguages.map((language) => {
            const isSelected = language.code === i18n.language;
            
            return (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 cursor-pointer rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isSelected && 'bg-accent/50 text-accent-foreground'
                )}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-xs text-muted-foreground">{language.code.toUpperCase()}</div>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {t('status.connected')}
                    </Badge>
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
        
        <div className="border-t border-border p-2">
          <div className="text-xs text-muted-foreground text-center">
            🌍 {supportedLanguages.length} idiomas disponíveis
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Hook personalizado para facilitar o uso
export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };
  
  const getCurrentLanguage = () => {
    return supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];
  };
  
  const isRTL = () => {
    return ['ar', 'he', 'fa'].includes(i18n.language);
  };
  
  return {
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    isRTL,
    supportedLanguages,
    t
  };
};

export default LanguageSelector;