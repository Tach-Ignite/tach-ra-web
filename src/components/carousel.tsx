// import React, {
//   ElementRef,
//   ReactElement,
//   ReactNode,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

// export type CarouselProps = {
//   pages: ReactNode[];
// };

// enum WorkflowState {
//   'idle',
//   'buttonDisabled',
//   'nodeAppended',
//   'animatedToNewNode',
//   'currentNodeUpdated',
//   'oldNodeRemoved',
//   'buttonEnabled',
// }

// enum DirectionState {
//   'none',
//   'left',
//   'right',
// }

// export function Carousel({ pages }: CarouselProps) {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [buttonsDisabled, setButtonsDisabled] = useState(false);
//   const [workflowState, setWorkflowState] = useState<WorkflowState>(
//     WorkflowState['idle'],
//   );
//   const [directionState, setDirectionState] = useState<DirectionState>(
//     DirectionState['none'],
//   );
//   const parentRef = useRef<HTMLDivElement>(null);
//   const [baseWidth, setBaseWidth] = useState(0);
//   const [refClasses, setRefClasses] = useState<string>(
//     'flex w-full transition duration-1000 overflow-hidden',
//   );
//   let ref = useRef<any>(
//     <div className={refClasses}>
//       <div className="w-full">{pages[currentPage]}</div>
//     </div>,
//   );

//   useEffect(() => {
//     if (parentRef && parentRef.current) {
//       setBaseWidth(parentRef.current.offsetWidth);
//     }
//   }, [parentRef]);

//   const handleLeftClick = useCallback(() => {
//     setDirectionState(DirectionState['left']);
//     setButtonsDisabled(true);
//     setWorkflowState(WorkflowState['buttonDisabled']);
//   }, [setDirectionState, setButtonsDisabled, setWorkflowState]);

//   const handleRightClick = useCallback(() => {
//     setDirectionState(DirectionState['right']);
//     setButtonsDisabled(true);
//     setWorkflowState(WorkflowState['buttonDisabled']);
//   }, [setDirectionState, setButtonsDisabled, setWorkflowState]);

//   useEffect(() => {
//     if (workflowState === WorkflowState['buttonDisabled']) {
//       //append new node
//       const children =
//         pages && pages[currentPage]
//           ? [
//               <div className={`w-[${baseWidth}px] shrink-0`}>
//                 {pages[currentPage]}
//               </div>,
//             ]
//           : [];
//       let newChildren: ReactNode[] = [];
//       if (directionState === DirectionState['left']) {
//         const nextPageNumber =
//           currentPage === 0 ? pages.length - 1 : currentPage - 1;
//         newChildren = Array.isArray(children)
//           ? [
//               <div className={`w-[${baseWidth}px] shrink-0`}>
//                 {pages[nextPageNumber]}
//               </div>,
//               ...children,
//             ]
//           : [
//               <div className={`w-[${baseWidth}px] shrink-0`}>
//                 {pages[nextPageNumber]}
//               </div>,
//               children,
//             ];
//       } else if (directionState === DirectionState['right']) {
//         const nextPageNumber =
//           currentPage === pages.length - 1 ? 0 : currentPage + 1;
//         newChildren = Array.isArray(children)
//           ? [
//               ...children,
//               <div className={`w-[${baseWidth}px] shrink-0`}>
//                 {pages[nextPageNumber]}
//               </div>,
//             ]
//           : [
//               children,
//               <div className={`w-[${baseWidth}px] shrink-0`}>
//                 {pages[nextPageNumber]}
//               </div>,
//             ];
//       }
//       const clonedElement = React.cloneElement(
//         ref.current,
//         ref.current.props,
//         newChildren,
//       );
//       ref.current = clonedElement;

//       setRefClasses(
//         `flex transition duration-1000 overflow-hidden w-[${baseWidth}px]`,
//       );

//       setWorkflowState(WorkflowState['nodeAppended']);
//     }
//   }, [
//     workflowState,
//     setWorkflowState,
//     ref,
//     currentPage,
//     pages,
//     directionState,
//     baseWidth,
//   ]);

//   useEffect(() => {
//     if (workflowState === WorkflowState['nodeAppended']) {
//       //animate to new node
//       const width = ref.current.offsetWidth;
//       const prefix = directionState === DirectionState['left'] ? '-' : '';
//       const transform = `${prefix}translate-x-[${baseWidth}px]`;
//       // const clonedElement = React.cloneElement(
//       //   ref.current,
//       //   {
//       //     ...ref.current.props,
//       //     className: `flex transition duration-1000 w-[${baseWidth}px] overflow-hidden ${transform}`,
//       //   },
//       //   ref.current.props.children,
//       // );
//       // ref.current = clonedElement;

//       setRefClasses(
//         `flex transition duration-1000 w-[${baseWidth}px] overflow-hidden ${transform}`,
//       );

//       setTimeout(() => {
//         setWorkflowState(WorkflowState['animatedToNewNode']);
//       }, 1000);
//     }
//   }, [
//     workflowState,
//     setWorkflowState,
//     ref,
//     currentPage,
//     pages,
//     directionState,
//     baseWidth,
//   ]);

//   useEffect(() => {
//     return;
//     if (workflowState === WorkflowState['animatedToNewNode']) {
//       setCurrentPage((current) => {
//         if (directionState === DirectionState['left']) {
//           current === 0 ? pages.length - 1 : current - 1;
//         } else if (directionState === DirectionState['right']) {
//           current === pages.length - 1 ? 0 : current + 1;
//         } else {
//           current = 0;
//         }
//         setWorkflowState(WorkflowState['currentNodeUpdated']);
//         return current;
//       });
//     }
//   }, [
//     workflowState,
//     setWorkflowState,
//     ref,
//     currentPage,
//     pages,
//     directionState,
//   ]);

//   useEffect(() => {
//     if (workflowState === WorkflowState['currentNodeUpdated']) {
//       ref.current = (
//         <div className="flex w-full transition duration-1000 overflow-hidden">
//           <div className="w-full">{pages[currentPage]}</div>
//         </div>
//       );

//       setWorkflowState(WorkflowState['oldNodeRemoved']);
//     }
//   }, [
//     workflowState,
//     setWorkflowState,
//     ref,
//     currentPage,
//     pages,
//     directionState,
//   ]);

//   useEffect(() => {
//     if (workflowState === WorkflowState['oldNodeRemoved']) {
//       setButtonsDisabled(false);
//       setWorkflowState(WorkflowState['idle']);
//     }
//   }, [
//     workflowState,
//     setWorkflowState,
//     ref,
//     currentPage,
//     pages,
//     directionState,
//   ]);

//   if (pages.length === 0) {
//     return null;
//   }

//   return (
//     <div className="flex flex-col lg:flex-row items-center gap-8">
//       {pages.length > 0 && (
//         <button
//           type="button"
//           disabled={buttonsDisabled}
//           className="flex-none w-12 h-12 rounded-full border-2 border-tachPurple flex items-center justify-center cursor-pointer"
//           onClick={handleLeftClick}
//         >
//           <FaChevronLeft className="w-8 h-8" />
//         </button>
//       )}
//       <div className="grow transition duration-1000" ref={parentRef}>
//         {ref.current}
//       </div>

//       {pages.length > 0 && (
//         <button
//           type="button"
//           disabled={buttonsDisabled}
//           className="flex-none w-12 h-12 rounded-full border-2 border-tachPurple flex items-center justify-center cursor-pointer"
//           onClick={handleRightClick}
//         >
//           <FaChevronRight className="w-8 h-8" />
//         </button>
//       )}
//     </div>
//   );
// }
