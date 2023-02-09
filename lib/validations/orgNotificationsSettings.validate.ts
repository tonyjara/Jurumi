import type { OrgNotificationSettings } from '@prisma/client';
import * as z from 'zod';

export const validateOrgNotificationSettings: z.ZodType<OrgNotificationSettings> =
  z.lazy(() =>
    z.object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      allowNotifications: z.boolean(),
      approversSlackChannelId: z.string(),
      administratorsSlackChannelId: z.string(),
      annoncementsSlackChannelId: z.string(),
      orgId: z.string(),
    })
  );

export type FormOrgNotificationSettings = z.infer<
  typeof validateOrgNotificationSettings
>;

export const defaultOrgNotificationSettingsData: FormOrgNotificationSettings = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  allowNotifications: true,
  approversSlackChannelId: '',
  administratorsSlackChannelId: '',
  annoncementsSlackChannelId: '',
  orgId: '',
};
