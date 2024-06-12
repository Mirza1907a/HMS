import { useState } from "react";

import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const StaffNotificationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          This is just a static page to fill the design the functionality wouldn't work.
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  );
};

export function NotificationsForm() {
  const defaultValues = {
    type: "all",
    mobile: false,
    communication_emails: false,
    marketing_emails: false,
    social_emails: true,
    security_emails: true,
  };
  const {toast} = useToast();

  const [formData, setFormData] = useState(defaultValues);

  function handleChange(e) {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    toast({
      title: "Congrats! you submitted nothing.",
      description: "This is just a static page to fill the design will make this functional later in the future!"
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <label>Notify me about...</label>
        <div className="flex flex-col space-y-1">
          <RadioGroup
            onValueChange={formData.onChange}
            defaultValue={formData.value}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem
                name="type"
                value="all"
                checked={formData.type === "all"}
                onChange={handleChange}
              />
              <label className="font-normal">All new messages</label>
            </div>
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem
                name="type"
                value="mentions"
                checked={formData.type === "mentions"}
                onChange={handleChange}
              />
              <label className="font-normal">
                Direct messages and mentions
              </label>
            </div>
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem
                name="type"
                value="none"
                checked={formData.type === "none"}
                onChange={handleChange}
              />
              <label className="font-normal">Nothing</label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base">Communication emails</label>
              <p className="text-sm">
                Receive emails about your account activity.
              </p>
            </div>
            <Switch
              name="communication_emails"
              checked={formData.communication_emails}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base">Marketing emails</label>
              <p className="text-sm">
                Receive emails about new products, features, and more.
              </p>
            </div>
            <Switch
              name="marketing_emails"
              checked={formData.marketing_emails}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base">Social emails</label>
              <p className="text-sm">
                Receive emails for friend requests, follows, and more.
              </p>
            </div>
            <Switch
              name="social_emails"
              checked={formData.social_emails}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base">Security emails</label>
              <p className="text-sm">
                Receive emails about your account activity and security.
              </p>
            </div>
            <Switch
              name="security_emails"
              checked={formData.security_emails}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0">
        <Checkbox
          name="mobile"
          checked={formData.mobile}
          onChange={handleChange}
        />
        <div className="space-y-1 leading-none">
          <label>Use different settings for my mobile devices</label>
          <p className="text-sm">
            You can manage your mobile notifications in the{" "}
            <Link href="/examples/forms">mobile settings</Link> page.
          </p>
        </div>
      </div>

      <Button type="submit">Update notifications</Button>
    </form>
  );
}
