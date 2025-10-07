import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Inter', 'Source Sans Pro', 'system-ui', 'sans-serif'],
				'heading': ['Source Sans Pro', 'Inter', 'sans-serif'],
				'body': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				// Healthcare-specific color palette
				healthcare: {
					primary: '#2563eb', // Professional blue
					secondary: '#059669', // Calming green
					accent: '#7c3aed', // Trust purple
					warning: '#d97706', // Attention orange
					danger: '#dc2626', // Crisis red
					success: '#16a34a', // Positive green
					info: '#0891b2', // Information cyan
					bg: '#f8fafc', // Clean background
					surface: '#ffffff', // Card surfaces
					muted: '#64748b', // Muted text
				},
				// Mental health specific colors
				mood: {
					very_low: '#ef4444', // Red
					low: '#f97316', // Orange
					neutral: '#eab308', // Yellow
					good: '#22c55e', // Green
					very_good: '#3b82f6', // Blue
				},
				// Risk level colors
				risk: {
					minimal: '#10b981', // Green
					mild: '#f59e0b', // Amber
					moderate: '#f97316', // Orange
					severe: '#ef4444', // Red
					critical: '#991b1b', // Dark red
				},
				// Accessibility compliant colors
				a11y: {
					focus: '#2563eb',
					'focus-ring': 'rgba(37, 99, 235, 0.2)',
					'high-contrast': '#000000',
					'high-contrast-bg': '#ffffff',
				},
				// Standard UI colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
        'fade-in-down': {
          '0%': {
              opacity: '0',
              transform: 'translateY(-10px)'
          },
          '100%': {
              opacity: '1',
              transform: 'translateY(0)'
          },
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-down': 'fade-in-down 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
