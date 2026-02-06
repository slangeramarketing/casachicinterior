// File: lib/email/templates/welcomeEmail.ts

import { UserRole } from "@/modules/users/user.dto";

export const getWelcomeEmailTemplate = (data: {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  baseUrl: string;
}) => {
  const primaryColor = "#ff6900"; // CasaChic Primary Color
  const loginUrl = `${data.baseUrl}/admin`; // Redirecting to login page

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; text-transform: uppercase;">
          Casa<span style="color: ${primaryColor};">Chic</span>
        </h1>
        <p style="color: ${primaryColor}; margin: 5px 0 0 0; font-size: 10px; letter-spacing: 3px;">INTERIOR & RENOVATION EXPERTS</p>
      </div>
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #333; margin-top: 0;">Hi ${data.name},</h2>
        <p style="color: #555; line-height: 1.6;">Welcome to the CasaChic team! Your admin account has been created. You can now access the dashboard with the following credentials:</p>
        
        <div style="background-color: #fff5ed; border-left: 4px solid ${primaryColor}; padding: 20px; margin: 25px 0;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Login Details:</p>
          <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 5px 0; color: #555;"><strong>Password:</strong> ${data.password}</p>
          <p style="margin: 5px 0; color: #555;"><strong>Role:</strong> <span style="text-transform: capitalize;">${data?.role?.replace('_', ' ')}</span></p>
        </div>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${loginUrl}" 
             style="background-color: ${primaryColor}; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
             LOGIN TO DASHBOARD
          </a>
        </div>

        <p style="color: #888; font-size: 12px; font-style: italic;">Note: Please don't share your password to any one!  </p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee; color: #aaa; font-size: 11px;">
        © 2026 CasaChic Interior Design. All rights reserved.
      </div>
    </div>
  `;
};