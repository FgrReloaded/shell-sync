import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Container } from "@/components/container";


export default function Home() {

  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-mono text-foreground text-3xl font-bold mb-4">
			BETTER T STACK
		</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>System Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>LIVE</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.md,
  },
  heroSection: {
    paddingVertical: theme.spacing.xl,
  },
  heroTitle: {
    fontSize: theme.fontSize["4xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.mutedForeground,
    lineHeight: 28,
  },
  statusCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  statusTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.cardForeground,
  },
  statusBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: theme.spacing.xs,
    borderRadius: 9999,
  },
  statusBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: "500",
    color: theme.colors.secondaryForeground,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + 4,
  },
  statusDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  statusDotSuccess: {
    backgroundColor: theme.colors.success,
  },
  statusDotWarning: {
    backgroundColor: "#F59E0B",
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
    color: theme.colors.cardForeground,
  },
  statusDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  }
}));
