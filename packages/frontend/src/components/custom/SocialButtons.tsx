import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SocialButtons() {
  return (
    <TooltipProvider>
      <div className="flex justify-center space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className="w-12 h-12 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors hover-float"
              variant="outline"
            >
              <FaGithub className="w-4 h-4 " />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>GitHub</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className="w-12 h-12 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors hover-float"
              variant="outline"
            >
              <FaXTwitter className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Twitter</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className="w-12 h-12 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors hover-float"
              variant="outline"
            >
              <FaLinkedin className="w-4 h-4 " />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>LinkedIn</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
