import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity, FlatList, } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const dummySyllabus = [
    {
        id: '1',
        chepterName: 'Sets and Functions',
        subTopics: [
            {
                subTopicTitle: 'Sets',
                innerSubTopics: [
                    {
                        innerSubTopicTitle: 'Sets and their representations',
                    },
                    {
                        innerSubTopicTitle: 'Empty set',
                    },
                    {
                        innerSubTopicTitle: 'Finite and Infinite sets',
                    },
                    {
                        innerSubTopicTitle: 'Equal sets. Subsets',
                    },
                    {
                        innerSubTopicTitle: 'Subsets of a set of real numbers especially intervals',
                    },
                    {
                        innerSubTopicTitle: 'Power set',
                    },
                    {
                        innerSubTopicTitle: 'Universal set',
                    },
                    {
                        innerSubTopicTitle: 'Venn diagrams',
                    },
                    {
                        innerSubTopicTitle: 'Union and Intersection of sets',
                    },
                    {
                        innerSubTopicTitle: 'Difference of sets',
                    },
                    {
                        innerSubTopicTitle: 'Complement of a set',
                    },
                    {
                        innerSubTopicTitle: 'Properties of Complement Sets',
                    },
                    {
                        innerSubTopicTitle: 'Practical Problems based on sets',
                    },
                ],
            },
            {
                subTopicTitle: 'Relations & Functions',
                innerSubTopics: [
                    {
                        innerSubTopicTitle: 'Ordered pairs',
                        extraInnerSubTopics: [
                            {
                                extraInnerSubTopicTitle: 'Cartesian product of sets',
                            }
                        ]
                    },
                    {
                        innerSubTopicTitle: 'Number of elements in the cartesian product of two finite sets',
                    },
                    {
                        innerSubTopicTitle: 'Cartesian product of the sets of real (up to R × R)',
                    },
                    {
                        innerSubTopicTitle: 'Definition of −',
                        extraInnerSubTopics: [
                            {
                                extraInnerSubTopicTitle: 'Relation',
                            },
                            {
                                extraInnerSubTopicTitle: 'Pictorial diagrams',
                            },
                            {
                                extraInnerSubTopicTitle: 'Domain',
                            },
                            {
                                extraInnerSubTopicTitle: 'Co-domain',
                            },
                            {
                                extraInnerSubTopicTitle: 'Range of a relation',
                            }
                        ]
                    },
                    {
                        innerSubTopicTitle: 'Function as a special kind of relation from one set'
                    },
                    {
                        innerSubTopicTitle: 'Pictorial representation of a function, domain, co-domain and range of a function'
                    },
                    {
                        innerSubTopicTitle: 'Real valued functions, domain and range of these functions −',
                        extraInnerSubTopics: [
                            {
                                extraInnerSubTopicTitle: 'Constant',
                            },
                            {
                                extraInnerSubTopicTitle: 'Identity',
                            },
                            {
                                extraInnerSubTopicTitle: 'Polynomial',
                            },
                            {
                                extraInnerSubTopicTitle: 'Rational',
                            },
                            {
                                extraInnerSubTopicTitle: 'Modulus'
                            },
                            {
                                extraInnerSubTopicTitle: 'Signum',
                            },
                            {
                                extraInnerSubTopicTitle: 'Exponential',
                            },
                            {
                                extraInnerSubTopicTitle: 'Logarithmic',
                            },
                            {
                                extraInnerSubTopicTitle: 'Greatest integer functions (with their graphs)',
                            }
                        ],
                    },
                    {
                        innerSubTopicTitle: 'Sum, difference, product and quotients of functions.'
                    }
                ],
            },
            {
                subTopicTitle: 'Trigonometric Functions',
                innerSubTopics: [
                    {
                        innerSubTopicTitle: 'Positive and negative angles'
                    },
                    {
                        innerSubTopicTitle: 'Measuring angles in radians and in degrees and conversion of one into other',
                    },
                    {
                        innerSubTopicTitle: 'Definition of trigonometric functions with the help of unit circle',
                    },
                    {
                        innerSubTopicTitle: 'Truth of the sin2x + cos2x = 1, for all x',
                    },
                    {
                        innerSubTopicTitle: 'Signs of trigonometric functions',
                    },
                    {
                        innerSubTopicTitle: 'Domain and range of trigonometric functions and their graphs',
                    },
                    {
                        innerSubTopicTitle: 'Expressing sin (x±y) and cos (x±y) in terms of sinx, siny,cosx & cosy and their simple application',
                    },
                    {
                        innerSubTopicTitle: 'Identities related to sin 2x, cos2x, tan 2x, sin3x, cos3x and tan3x',
                    },
                    {
                        innerSubTopicTitle: 'General solution of trigonometric equations of the type sin y = sin a, cos y = cos a and tan y = tan a.',
                    },
                ],
            }
        ],
    },
    {
        id: '2',
        chepterName: 'Algebra',
        subTopics: [
            {
                subTopicTitle: 'Principle of Mathematical Induction',
                innerSubTopics: [
                    {
                        innerSubTopicTitle: 'Process of the proof by induction -',
                        extraInnerSubTopics: [
                            {
                                extraInnerSubTopicTitle: 'Motivating the application of the method by looking at natural numbers as the least inductive subset of real numbers'
                            }
                        ],
                    },
                    {
                        innerSubTopicTitle: 'The principle of mathematical induction and simple applications'
                    }
                ],
            },
            {
                subTopicTitle: 'Complex Numbers and Quadratic Equations',
                innerSubTopics: [
                    {
                        innerSubTopicTitle: 'Need for complex numbers, especially √1, to be motivated by inability to solve some of the quadratic equation'
                    },
                    {
                        innerSubTopicTitle: 'Algebraic properties of complex numbers'
                    },
                    {
                        innerSubTopicTitle: 'Argand plane and polar representation of complex numbers'
                    },
                    {
                        innerSubTopicTitle: 'Statement of Fundamental Theorem of Algebra'
                    },
                    {
                        innerSubTopicTitle: 'Solution of quadratic equations in the complex number system'
                    },
                    {
                        innerSubTopicTitle: 'Square root of a complex number'
                    },
                ]
            },
            {
                subTopicTitle: 'Linear Inequalities',
                innerSubTopics: [
                    {
                        innerSubTopicTitle: 'Linear inequalities',
                    },
                    {
                        innerSubTopicTitle: 'Algebraic solutions of linear inequalities in one variable and their representation on the number line',
                    },
                    {
                        innerSubTopicTitle: 'Graphical solution of linear inequalities in two variables',
                    },
                    {
                        innerSubTopicTitle: 'Graphical solution of system of linear inequalities in two variables',
                    }
                ],
            },
            {
                subTopicTitle: 'Permutations and Combinations',
                innerSubTopics: [
                    {
                        innerSubTopicTitle: 'Fundamental principle of counting',
                    },
                    {
                        innerSubTopicTitle: 'Factorial n',
                    },
                    {
                        innerSubTopicTitle: '(n!) Permutations and combinations',
                    },
                    {
                        innerSubTopicTitle: 'Derivation of formulae and their connections',
                    },
                    {
                        innerSubTopicTitle: 'Simple applications.',
                    },
                ],
            },
            {
                subTopicTitle: 'Binomial Theorem',
                innerSubTopics: [
                    {
                        innerSubTopicTitle: 'History'
                    },
                    {
                        innerSubTopicTitle: 'Statement and proof of the binomial theorem for positive integral indices'
                    },
                    {
                        innerSubTopicTitle: 'Pascal\'s triangle'
                    },
                    {
                        innerSubTopicTitle: 'General and middle term in binomial expansion'
                    },
                    {
                        innerSubTopicTitle: 'Simple applications'
                    },
                ],
            },
            {
                subTopicTitle: 'Sequence and Series',
                innerSubTopics: [
                    {
                        innerSubTopicTitle: 'Sequence and Series'
                    },
                    {
                        innerSubTopicTitle: 'Arithmetic Progression (A.P.)'
                    },
                    {
                        innerSubTopicTitle: 'Arithmetic Mean (A.M.)'
                    },
                    {
                        innerSubTopicTitle: 'Geometric Progression (G.P.)'
                    },
                    {
                        innerSubTopicTitle: 'General term of a G.P.'
                    },
                    {
                        innerSubTopicTitle: 'Sum of n terms of a G.P.'
                    },
                    {
                        innerSubTopicTitle: 'Arithmetic and Geometric series infinite G.P. and its sum'
                    },
                    {
                        innerSubTopicTitle: 'Geometric mean (G.M.)'
                    },
                    {
                        innerSubTopicTitle: 'Relation between A.M. and G.M.'
                    },
                ],
            },
        ],
    },
    {
        id: '3',
        chepterName: 'Coordinate Geometry',
        subTopics: [
            {
                subTopicTitle: 'Straight Lines',
            },
            {
                subTopicTitle: 'Conic Sections',
            },
            {
                subTopicTitle: 'Introduction to Three–dimensional Geometry',
            },
        ],
    },
    {
        id: '4',
        chepterName: 'Calculus',
        subTopics: [
            {
                subTopicTitle: 'Limits and Derivatives',
            },
        ],
    },
    {
        id: '5',
        chepterName: 'Statistics and Probability',
        subTopics: [
            {
                subTopicTitle: '5.1 Statistics',
            },
            {
                subTopicTitle: '5.2  Probability',
            }
        ],
    },
];

const subjectsAccourdingSyllabusList = [
    {
        id: '1',
        subject: 'Math',
        heading: 'Mathematics Syllabus 2021-22',
        syllabus: dummySyllabus,
    },
    {
        id: '2',
        subject: 'Sci',
        heading: 'Science Syllabus 2021-22',
        syllabus: dummySyllabus,
    },
    {
        id: '3',
        subject: 'Eng',
        heading: 'English Syllabus 2021-22',
        syllabus: dummySyllabus,
    },
    {
        id: '4',
        subject: 'Eco',
        heading: 'Economics Syllabus 2021-22',
        syllabus: dummySyllabus,
    },
    {
        id: '5',
        subject: 'AC',
        heading: 'Accountancy  Syllabus 2021-22',
        syllabus: dummySyllabus,
    },
    {
        id: '6',
        subject: 'Com',
        heading: 'Computer Syllabus 2021-22',
        syllabus: dummySyllabus,
    },
];

const SyllabusScreen = () => {

    const navigation = useNavigation();

    const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <MyStatusBar />
            <ImageBackground
                source={require('../../assets/images/bgImage.png')}
                style={{ width: '100%', height: 250, flex: 1, }}
                resizeMode="stretch"
                tintColor={Colors.whiteColor}
            >
                {header()}
                {subjectAndSyllabusInfo()}
            </ImageBackground>
        </View>
    )

    function subjectAndSyllabusInfo() {
        return (
            <View style={styles.sheetStyle}>
                {subjects()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}>
                    {syllabus()}
                </ScrollView>
            </View>
        )
    }

    function syllabus() {
        return (
            <View style={styles.syllabusWrapStyle}>
                <Text numberOfLines={1} style={{ paddingVertical: Sizes.fixPadding, textAlign: 'center', ...Fonts.blackColor14Medium }}>
                    {subjectsAccourdingSyllabusList[selectedSubjectIndex].heading}
                </Text>
                <View style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, }} />
                <View style={{ marginTop: Sizes.fixPadding * 2.0, }}>
                    {
                        subjectsAccourdingSyllabusList[selectedSubjectIndex].syllabus.map((item, index) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { navigation.push('syllabusDetail/syllabusDetailScreen', { syllabus: JSON.stringify(subjectsAccourdingSyllabusList[selectedSubjectIndex].syllabus) }) }}
                                key={`${index}`}
                                style={{ marginHorizontal: Sizes.fixPadding, marginBottom: Sizes.fixPadding * 2.0, }}
                            >
                                <Text style={{ ...Fonts.blackColor15Medium }}>
                                    {index + 1}. {item.chepterName}
                                </Text>
                                {
                                    item.subTopics.map((topics, innerIndex) => (
                                        <View key={`${innerIndex}`} style={{ flexDirection: 'row', marginTop: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 3.0, }}>
                                            <Text style={{ ...Fonts.grayColor13Regular, }}>
                                                {index + 1}.{innerIndex + 1}
                                            </Text>
                                            <Text style={{ flex: 1, ...Fonts.grayColor13Regular, marginLeft: Sizes.fixPadding - 5.0, }}>
                                                {topics.subTopicTitle}
                                            </Text>
                                        </View>
                                    ))
                                }
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        )
    }

    function subjects() {
        const renderItem = ({ item, index }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedSubjectIndex(index)}
                style={{
                    backgroundColor: index == selectedSubjectIndex ? Colors.secondaryColor : 'transparent',
                    marginHorizontal: index == 0 || index == subjectsAccourdingSyllabusList.length - 1 ? 0.0 : Sizes.fixPadding - 5.0,
                    paddingHorizontal: index == selectedSubjectIndex ? Sizes.fixPadding + 10.0 : Sizes.fixPadding + 2.0,
                    ...styles.subjectWrapStyle,
                }}
            >
                <Text style={index == selectedSubjectIndex ? { ...Fonts.whiteColor13Medium } : { ...Fonts.blackColor13Medium }}>
                    {item.subject}
                </Text>
            </TouchableOpacity>
        )
        return (
            <View style={styles.allSubjectsWrapStyle}>
                <FlatList
                    data={subjectsAccourdingSyllabusList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Syllabus
                </Text>
            </View>
        )
    }
}

export default SyllabusScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        marginVertical: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    sheetStyle: {
        backgroundColor: Colors.whiteColor,
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        flex: 1,
        marginBottom: -(Sizes.fixPadding * 5.0),
        overflow: "hidden",
        paddingBottom: Sizes.fixPadding * 5.0,
    },
    syllabusWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.lightGrayColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    subjectWrapStyle: {
        borderRadius: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 4.0,
    },
    allSubjectsWrapStyle: {
        borderColor: Colors.secondaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding * 2.0,
        margin: Sizes.fixPadding * 2.0,
        overflow: 'hidden'
    }
})