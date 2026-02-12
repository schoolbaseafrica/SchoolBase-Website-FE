import React from "react"

import ComingSoon from "@/components/coming-soon"
import { AnimatedPage } from "../_components/page-animations"

const page = () => {
  return (
    <AnimatedPage>
      <ComingSoon
        pageTitle="Coming Soon"
        message="This page is being crafted with care."
        showNotifyButton={false}
      />
    </AnimatedPage>
  )
}

export default page
