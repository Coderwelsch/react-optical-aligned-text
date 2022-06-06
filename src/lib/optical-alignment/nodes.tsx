import React, { useContext } from "react"

import AwesomeTypographyContext from "../../context/AwesomeTypographyContext"
import { OpticalAlignmentNodesProps } from "../../types"
import { NON_BREAKING_SPACE } from "../constants"
import { Node } from "./node"


export function OpticalAlignmentNodes ({
	fixedText,
}: OpticalAlignmentNodesProps): JSX.Element {
	const {
		debug,
		opticalAlignmentRules = [],
		enableOrphanPrevention = true,
	} = useContext(AwesomeTypographyContext)

	let shouldSkipLast = false
	const split: string[] = fixedText.split(" ")

	const transformed = split.map((part, index) => {
		const isLast = index === split.length - 1
		const isForelast = index === split.length - 2

		if (isLast && shouldSkipLast) {
			return
		}

		for (let ruleIndex = 0; ruleIndex < opticalAlignmentRules.length; ruleIndex++) {
			const rule = opticalAlignmentRules[ruleIndex]
			const { test, id } = rule

			// break on first occurence to preserve
			// overwriting rules
			if (test.test(part)) {
				let suffix: string = ""

				/*
				*
				* ======================================
				* ======= Orphan Prevention Info ========
				* ======================================
				*
				* * It isn possible to prevent word breaks
				* for span and text elements, so I had to
				* render the last word within the forelast
				* loop execution.
				*
				* */

				if (isForelast && enableOrphanPrevention) {
					const lastWord = split[split.length - 1]

					suffix = NON_BREAKING_SPACE + lastWord
					shouldSkipLast = true
				}

				return (
					<Node
						key={ `${ index }-${ part }-${ id }` }
						text={ part + suffix }
						rule={ rule }
						debug={ debug }
					/>
				)
			}
		}

		let suffix: string = " "

		if (enableOrphanPrevention && isLast) {
			suffix = NON_BREAKING_SPACE
		}

		return (
			suffix + part
		)
	})

	return (
		<>
			{ transformed }
		</>
	)
}